import * as assert from "node:assert";
import chromedriver from "chromedriver";
import { remote } from 'webdriverio';

// Launch Chrome
const args = ['--port=4444'];
await chromedriver.start(args, true);

// Launch WebDriver BiDi
const browser = await remote({
    capabilities: { browserName: 'chrome', webSocketUrl: true, }
});

// Monitor console messages
await browser.send({
  method: 'session.subscribe',
  params: { events: ['log.entryAdded'] }
});
  
browser.on('message', (data) => {
  const {params} = JSON.parse(data);
  if (params?.level != 'error') return;
  console.log('RECEIVED: %s', params?.text);
});

// Action
await browser.setWindowSize(600, 1041);
await browser.url("https://coffee-cart.app/?breakable=1");
await browser.$("[data-test='Espresso']").click();

// Assert
const checkout = await browser.$('[data-test="checkout"]');
assert.strictEqual(await checkout.getText(), 'Total: $10.00');

browser.closeWindow();
browser.deleteSession();
chromedriver.stop();
    