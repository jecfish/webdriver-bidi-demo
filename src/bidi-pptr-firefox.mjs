import * as assert from 'node:assert'; 
import puppeteer from 'puppeteer';

// Arrange: Launch browser with WebDriver BiDi
const browser = await puppeteer.launch({
  protocol: 'webDriverBiDi',
  product: 'firefox', // or 'chrome'
  headless: false
});
const context = await browser.createIncognitoBrowserContext();
const page = await context.newPage();

// Arrange: Monitor console messages
page.on('console', message => {
  if (message.type() != 'error') return;
  console.log('RECEIVED: %s', message.text());
  // assert.fail(`Unexpected console message received: ${message.text()}`);
});

// Action
await page.setViewport({width: 600, height: 1041});
await page.goto('https://coffee-cart.app/?breakable=1');

const coffee = await page.waitForSelector('[data-test="Espresso"]');
await coffee.click();

// Assert 
const checkout = await page.$('[data-test="checkout"]');
const total = await checkout.evaluate(el => el.textContent);
assert.equal(total, 'Total: $10.00');

browser.close();

