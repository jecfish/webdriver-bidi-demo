import * as assert from "node:assert";
import puppeteer from "puppeteer";

// Launch WebDriver BiDi
const browser = await puppeteer.launch({
  protocol: 'webDriverBiDi'
});

const context = await browser.createIncognitoBrowserContext();
const page = await context.newPage();

// Monitor console messages
page.on('console', message => {
  if (message.type() != 'error') return;
  console.log('RECEIVED: %s', message.text());
});

// Action
await page.evaluate(() => {
  document.body.innerHTML = `
    <button data-test="Espresso" onclick="
      document.querySelector('[data-test=checkout]').innerText = 'Total: $10.00';
      console.error('Some additional workflow is broken.');
    ">Espresso</button>
    <div data-test="checkout"></div>
  `;
});

await page.evaluate(() => {
  document.querySelector('[data-test="Espresso"]').click();
});

// Assert
const checkout = await page.evaluate(() => document.querySelector('[data-test="checkout"]').innerText);
assert.strictEqual(await checkout, 'Total: $10.00');

browser.close();
