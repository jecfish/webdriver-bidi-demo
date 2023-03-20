import * as assert from "node:assert";
import puppeteer from "puppeteer";

// Launch CDP headless
const browser = await puppeteer.launch({
  headless: 'new'
});

const context = await browser.createIncognitoBrowserContext();
const page = await context.newPage();

// Monitor console messages
page.on('console', async (message) => {
  if (message.type() != 'error') return;
  console.log('RECEIVED: %s', message.text());
});

// Action
await page.setViewport({width: 600, height: 1041});
await page.goto('https://coffee-cart.app/?breakable=1');

const coffee = await page.$('[data-test="Espresso"]');
await coffee.click();

// Assert
const checkout = await page.$('[data-test="checkout"]');
assert.strictEqual(await checkout.evaluate(x => x.textContent), 'Total: $10.00');

browser.close();
