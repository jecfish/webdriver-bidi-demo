import * as assert from "node:assert";
import puppeteer from "puppeteer";

// Launch WebDriver BiDi, Install firefox manually: npx puppeteer browsers install firefox
const browser = await puppeteer.launch({
  product: 'firefox',
  protocol: 'webDriverBiDi',
  headless: false
});

const context = await browser.createIncognitoBrowserContext();
const page = await context.newPage();

// Monitor console messages
page.on('console', message => {
  if (message.type() != 'error') return;
  console.log('RECEIVED: %s', message.text());
  // assert.fail(`Unexpected console message received: ${message.text()}`);
});

await page.setViewport({width: 600, height: 1041});
await page.goto('https://coffee-cart.app/?breakable=1', { waitUntil: 'networkidle0' });

const coffee = await page.$('[data-test="Espresso"]');
await coffee.click();

browser.close();
