import { addExtra } from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import puppeteerCore from 'puppeteer-core';

const puppeteer = addExtra(puppeteerCore);
puppeteer.use(StealthPlugin());

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
    channel: 'chrome',
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox']
  });
  console.log("Browser connected securely.");
  const page = await browser.newPage();
  console.log("Page created.");
  await page.goto("https://example.com");
  console.log("Navigated.");
  await browser.close();
}
run().catch(console.error);
