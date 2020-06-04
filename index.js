require('chromedriver');

const user = process.env.USER;
const chrome = require("selenium-webdriver/chrome");
const selenium = require('selenium-webdriver');
const {Builder, By, Key, until, Capabilities} = require('selenium-webdriver');
const chromeOptions = new chrome.Options();

(async function myFunction() {
  let chromeCapabilities = Capabilities.chrome();
  
  chromeCapabilities.set('goog:chromeOptions', {
    'args': [
      `user-data-dir=/Users/${user}/Library/Application Support/Google/Chrome`,
      `--enable-profile-shortcut-manager`
    ]
  });

  const chromeDriver = await new Builder().forBrowser('chrome').withCapabilities(chromeCapabilities).build();

  await chromeDriver.get('chrome://system');
  await (chromeDriver.sleep(10000));

  let extButton = await chromeDriver.findElement(By.css('#extensions-value-btn'));

  extButton = await chromeDriver.wait(until.elementIsVisible(extButton), 5000);
  await (extButton.click())

  let extensionList = await chromeDriver.findElement(By.css('#extensions-value'));
  extensionList = await chromeDriver.wait(until.elementLocated(By.css('#extensions-value')));

  await extensionList.getText().then(async (text) => {
    let file = text;
    if (file) {

      console.log(`-----------------------------`);
      console.log(`Extensionss Found! Now updating Firefox`);
      console.log(`-----------------------------`);

      const firefox = require('selenium-webdriver/firefox');

      let formattedFile = file.split(' : ').filter((item, index) => index%2 == 1 && !item.includes('Chrome') && !item.includes('Web Store')).join('\n');
      let extensions = file.split(' : ').filter((item, index) => index%2 == 1 && !item.includes('Chrome') && !item.includes('Web Store'));

      const options = new firefox.Options();
      options.setBinary("/usr/local/bin/geckodriver");

      let searchText = (extension) => `https://addons.mozilla.org/en-US/firefox/search/?platform=mac&q=${extension}`

      let foundAddOns = 0;
      const driver = await new Builder().forBrowser('firefox').build();
      for (let i = 0; i < extensions.length; i++) {
        let ext = extensions[i];
        try {
          await driver.get(searchText(ext));
          let firstResult = await driver.findElement(By.css('a.SearchResult-link'));
          await driver.wait(until.elementLocated(By.css('header.Card-header')));
          firstResult = await driver.wait(until.elementIsVisible(firstResult), 1000);
          await (firstResult.click())
          let button = await driver.findElement(By.css('.AMInstallButton'));
          button = await driver.wait(until.elementIsVisible(button), 1000);
          await (button.click());
          await (driver.sleep(5000));
          foundAddOns += 1;
        } catch (e) {
          console.log('error occured', e);
        }
      }
      console.log(`-----------------------------`);
      console.log(`${foundAddOns} Addon's Found`);
      console.log(`-----------------------------`);
    } else {
      console.log(`-----------------------------`);
      console.log(`No Extensions found`);
      console.log(`-----------------------------`);
    }
  });
})();
console.log('done')