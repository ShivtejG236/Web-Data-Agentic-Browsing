import { addExtra } from 'puppeteer-extra';
import puppeteerCore from 'puppeteer-core';
const puppeteer = addExtra(puppeteerCore);
async function run() {
  const browser = await puppeteer.launch({
    headless: true,
    channel: 'chrome',
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  });
  console.log("SUCCESS!");
  await browser.close();
}
run().catch(console.error);
