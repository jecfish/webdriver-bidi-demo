import * as assert from "node:assert";
import { Builder, By, LogInspector } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";

// Launch WebDriver BiDi
const driver = new Builder()
  .forBrowser('chrome')
  .setChromeOptions(new chrome.Options().enableBidi())
  .build();

// Monitor console messages
const inspector = await LogInspector(driver);

await inspector.onConsoleEntry(async (logEntry) => {
  if (logEntry._level != 'error') return;
  console.log('RECEIVED: ', logEntry._text);
  // assert.fail(`Unexpected console message received: ${logEntry._text}`);
});

// Action
await driver.manage().window().setRect({ x: 0, y: 0, width: 600, height: 1041 });
await driver.get('https://coffee-cart.app/?breakable=1');
const coffee = await driver.findElement(By.css('[data-test="Espresso"]'));
await coffee.click();

// Assert
const checkout = await driver.findElement(By.css('[data-test="checkout"]'));
assert.strictEqual(await checkout.getText(), 'Total: $10.00');

driver.quit();
