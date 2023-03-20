import * as assert from "node:assert";
import geckodriver from "geckodriver";
import { remote } from "webdriverio";

// Launch Firefox
// kill port if it is used: lsof -ti tcp:4441 | xargs kill
const port = 4441;
const args = [`--port=${port}`];
const firefox = geckodriver.start(args);

// Launch WebDriver BiDi
const browser = await remote({
    port,
    capabilities: { browserName: 'firefox', webSocketUrl: true },
    services: [['geckodriver']],
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
await browser.url('https://coffee-cart.app/?breakable=1');
await browser.$('[data-test="Espresso"]').click();

// Assert
const checkout = await browser.$('[data-test="checkout"]');
assert.strictEqual(await checkout.getText(), 'Total: $10.00');

await browser.closeWindow();

firefox.kill();