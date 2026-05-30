import { addExtra } from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import puppeteerCore, { Browser } from 'puppeteer-core';

const puppeteer = addExtra(puppeteerCore);

puppeteer.use(StealthPlugin());

export interface StealthBrowserConfig {
  useBrightData?: boolean;
  stealthLevel?: 'standard' | 'advanced' | 'brightdata';
}

export async function launchStealthBrowser(config: StealthBrowserConfig = {}): Promise<Browser> {
  const { useBrightData, stealthLevel } = config;

  if (useBrightData) {
    if (!process.env.BRIGHTDATA_WS_ENDPOINT) {
      throw new Error('BRIGHTDATA_WS_ENDPOINT environment variable is missing.');
    }
    console.log('🌐 Launching browser via Bright Data Scraping Browser...');
    try {
      const browser = await puppeteer.connect({
        browserWSEndpoint: process.env.BRIGHTDATA_WS_ENDPOINT,
      });
      return browser as unknown as Browser;
    } catch (error: any) {
      throw new Error(`Failed to connect to Bright Data WS endpoint: ${error.message}`);
    }
  }

  console.log(`🕵️ Launching local stealth browser (Level: ${stealthLevel || 'standard'})...`);
  
  const args = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-blink-features=AutomationControlled',
    '--disable-infobars',
    '--window-size=1920,1080',
    '--ignore-certificate-errors',
  ];

  if (stealthLevel === 'advanced') {
    args.push('--disable-web-security');
    args.push('--disable-features=IsolateOrigins,site-per-process');
  }

  const browser = await puppeteer.launch({
    headless: true,
    channel: 'chrome',
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args,
    defaultViewport: null,
  });

  return browser as unknown as Browser;
}
