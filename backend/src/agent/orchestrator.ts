import { WebSocket } from 'ws';
import { launchStealthBrowser } from './stealth';
import db from '../db/database';
import { v4 as uuidv4 } from 'uuid';
import { createCursor } from 'ghost-cursor';

// Simple store for active WS connections per session
const activeConnections = new Map<string, WebSocket[]>();

export function registerConnection(sessionId: string, ws: WebSocket) {
  if (!activeConnections.has(sessionId)) {
    activeConnections.set(sessionId, []);
  }
  activeConnections.get(sessionId)?.push(ws);
  
  ws.on('close', () => {
    const conns = activeConnections.get(sessionId) || [];
    activeConnections.set(sessionId, conns.filter(c => c !== ws));
  });
}

function broadcastLog(sessionId: string, message: string, type: 'info' | 'success' | 'error' | 'step' = 'info') {
  const conns = activeConnections.get(sessionId) || [];
  const logEntry = JSON.stringify({ type: 'log', level: type, message, timestamp: new Date().toISOString() });
  for (const ws of conns) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(logEntry);
    }
  }
}

function broadcastScreenshot(sessionId: string, base64Image: string) {
  const conns = activeConnections.get(sessionId) || [];
  const payload = JSON.stringify({ type: 'screenshot', image: base64Image, timestamp: new Date().toISOString() });
  for (const ws of conns) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(payload);
    }
  }
}

export async function executeAgent(sessionId: string, agentId: string, prompt: string, targetDomain: string, stealthLevel: string) {
  // Delay for 2.5s to ensure the frontend has time to establish the WebSocket connection!
  await new Promise(r => setTimeout(r, 2500));
  
  broadcastLog(sessionId, `🚀 Initializing NemoClaw Agent Wrapper for Session ${sessionId}...`, 'info');
  
  try {
    broadcastLog(sessionId, `Connecting to browser (Stealth: ${stealthLevel})...`, 'step');
    const browser = await launchStealthBrowser({
      useBrightData: stealthLevel === 'brightdata',
      stealthLevel: stealthLevel as 'standard' | 'advanced' | 'brightdata'
    });
    
    broadcastLog(sessionId, 'Browser connected securely.', 'success');
    
    const page = await browser.newPage();
    
    // Set a realistic user agent if not using bright data (Bright data handles this)
    if (stealthLevel !== 'brightdata') {
       await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36');
    }

    broadcastLog(sessionId, `Navigating to target domain: ${targetDomain}`, 'step');
    await page.goto(targetDomain.startsWith('http') ? targetDomain : `https://${targetDomain}`, { waitUntil: 'networkidle2', timeout: 60000 });
    
    // Take initial screenshot
    const screenshot1 = await page.screenshot({ encoding: 'base64', type: 'jpeg', quality: 80 });
    broadcastScreenshot(sessionId, screenshot1 as string);
    broadcastLog(sessionId, `NemoClaw: Parsing DOM structure & assessing goals for: "${prompt}"`, 'info');
    
    // Instantiate Ghost Cursor for human-like interaction
    const cursor = createCursor(page);
    
    // Inject a visual cursor into the page so it shows up on screenshots for the demo!
    await page.evaluate(() => {
      const c = document.createElement('div');
      c.style.width = '20px'; c.style.height = '20px'; 
      c.style.background = 'rgba(239, 68, 68, 0.8)';
      c.style.border = '2px solid white';
      c.style.position = 'fixed'; c.style.zIndex = '999999'; 
      c.style.pointerEvents = 'none'; c.style.borderRadius = '50%';
      c.style.transition = 'left 0.1s, top 0.1s';
      document.body.appendChild(c);
      document.addEventListener('mousemove', e => { 
        c.style.left = (e.clientX - 10) + 'px'; 
        c.style.top = (e.clientY - 10) + 'px'; 
      });
    });

    broadcastLog(sessionId, `Simulating human mouse movements and scrolling...`, 'step');
    
    await cursor.moveTo({ x: 300, y: 300 });
    let s1 = await page.screenshot({ encoding: 'base64', type: 'jpeg', quality: 50 });
    broadcastScreenshot(sessionId, s1 as string);

    await cursor.moveTo({ x: 500, y: 500 });
    await page.evaluate(() => window.scrollBy({ top: 300, behavior: 'smooth' }));
    await new Promise(r => setTimeout(r, 800));
    
    let s2 = await page.screenshot({ encoding: 'base64', type: 'jpeg', quality: 50 });
    broadcastScreenshot(sessionId, s2 as string);

    await cursor.moveTo({ x: 200, y: 800 });
    await page.evaluate(() => window.scrollBy({ top: -100, behavior: 'smooth' }));
    await cursor.click(); // Random click to bypass some passive captchas
    
    let s3 = await page.screenshot({ encoding: 'base64', type: 'jpeg', quality: 50 });
    broadcastScreenshot(sessionId, s3 as string);
    
    // Extract metadata
    const title = await page.title();
    broadcastLog(sessionId, `Page Title Extracted: ${title}`, 'step');
    
    broadcastLog(sessionId, `Extracting text content from DOM for LLM analysis...`, 'info');
    const pageText = await page.evaluate(() => {
      const clone = document.cloneNode(true) as Document;
      const elementsToRemove = clone.querySelectorAll('script, style, noscript, iframe');
      elementsToRemove.forEach(el => el.remove());
      return clone.body.innerText.replace(/\\s+/g, ' ').substring(0, 15000);
    });

    broadcastLog(sessionId, `🤖 Analyzing extracted data with NVIDIA Llama-3.1...`, 'step');
    
    const apiKey = process.env.NEMOCLAW_API_KEY;
    if (!apiKey) throw new Error("NEMOCLAW_API_KEY is not set in environment.");

    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'meta/llama-3.1-8b-instruct',
        messages: [
          {
            role: 'system',
            content: "You are an elite data extraction and analysis agent. You are provided with the raw text content of a webpage and a specific user prompt. Analyze the text and answer the user's prompt as accurately as possible. Output your findings as structured JSON if appropriate, or plain text."
          },
          {
            role: 'user',
            content: `User Prompt: ${prompt}\n\nWebpage Content:\n${pageText}`
          }
        ],
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`LLM API Error: ${response.status} - ${errText}`);
    }

    const llmData = await response.json();
    const extractedData = llmData.choices[0].message.content;
    
    broadcastLog(sessionId, `✅ Analysis complete.`, 'success');
    
    // Final screenshot
    const screenshotFinal = await page.screenshot({ encoding: 'base64', type: 'jpeg', quality: 80, fullPage: true });
    broadcastScreenshot(sessionId, screenshotFinal as string);

    await browser.close();
    broadcastLog(sessionId, `Session completed. Browser closed safely.`, 'success');
    
    // Save to DB
    const finalResult = JSON.stringify({ title, data: extractedData });
    db.prepare(`UPDATE sessions SET status = 'completed', end_time = CURRENT_TIMESTAMP, result_data = ? WHERE id = ?`)
      .run(finalResult, sessionId);
      
    // Broadcast finish
    const conns = activeConnections.get(sessionId) || [];
    for (const ws of conns) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'finish', data: finalResult }));
      }
    }
  } catch (err: any) {
    console.error("ExecuteAgent caught an error:", err);
    broadcastLog(sessionId, `Agent execution failed: ${err.message}`, 'error');
    db.prepare(`UPDATE sessions SET status = 'failed', end_time = CURRENT_TIMESTAMP WHERE id = ?`).run(sessionId);
  }
}
