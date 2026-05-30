const apiKey = process.env.NEMOCLAW_API_KEY;

async function run() {
  console.log("Testing LLM API...");
  const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer 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`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'meta/llama-3.1-8b-instruct',
      messages: [{role: 'user', content: 'test'}],
      max_tokens: 10
    })
  });
  console.log("Status:", response.status);
  const data = await response.json();
  console.log(data.choices[0].message.content);
}

run();
