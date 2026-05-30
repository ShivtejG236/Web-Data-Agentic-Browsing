import { addExtra } from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import puppeteerCore from 'puppeteer-core';

const puppeteer = addExtra(puppeteerCore);
puppeteer.use(StealthPlugin());

async function run() {
  const args = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-blink-features=AutomationControlled',
    '--disable-infobars',
    '--window-size=1920,1080',
    '--ignore-certificate-errors',
  ];
  const browser = await puppeteer.launch({
    headless: true,
    channel: 'chrome',
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args,
    defaultViewport: null,
  });
  console.log("SUCCESS!");
  await browser.close();
}
run().catch(console.error);
