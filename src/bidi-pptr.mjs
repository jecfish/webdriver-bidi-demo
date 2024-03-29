import * as assert from "node:assert";
import puppeteer from "puppeteer";

// Launch WebDriver BiDi
const browser = await puppeteer.launch({
  protocol: 'webDriverBiDi',
  product: 'chrome',
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

const checkout = await page.$('[data-test="checkout"]');
const total = await checkout.evaluate(el => el.textContent);
assert.equal(total, 'Total: $10.00');

browser.close();
