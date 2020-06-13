require('chromedriver');

const user = process.env.USER;
const {Builder, By, until, Capabilities} = require('selenium-webdriver');

const chromeExtensionsListPath = `chrome://system`
const chromeExtensionsRevealButtonSelector = '#extensions-value-btn';
const chromeExtensionsListNodeSelector = `#extensions-value`;

const searchText = (extension) => `https://addons.mozilla.org/en-US/firefox/search/?platform=mac&q=${extension}`

const noResultsNodeSelector = `.SearchResults-message`;
const firstSearchResultNodeSelector = `a.SearchResult-link`;
const firefoxInstallButton = `.AMInstallButton`;

const userProvidedChromeDirectory = process.argv[2];

let foundAddOns = 0;
let failedAddOns = [];
let convertedAddons = [];

console.log(`-----------------------------`);
console.log(`-----------------------------`);
console.log('Running Chrome to Firefox');
console.log(`-----------------------------`);
console.log(`-----------------------------`);

(async function run() {
  const chromeCapabilities = Capabilities.chrome();
  const chromeProfileDirectory = userProvidedChromeDirectory || `/Users/${user}/Library/Application Support/Google/Chrome`;
  
  chromeCapabilities.set('goog:chromeOptions', {
    'args': [
      `user-data-dir=${chromeProfileDirectory}`
    ]
  });

  let chromeDriver;
  try {
    chromeDriver = await new Builder().forBrowser('chrome').withCapabilities(chromeCapabilities).build();
  } catch (e) {
    console.log('Invalid User Data Directory for chrome');
    console.log('Common Errors:');
    console.log('- Incorrect Chrome profile location');
    console.log('- Open instance of Chrome with target profile');
    console.log('- Open instance of Chrome');
    return;
  }

  // go to list of extensions in chrome system
  await chromeDriver.get(chromeExtensionsListPath);
  await chromeDriver.wait(until.elementLocated(By.css(chromeExtensionsRevealButtonSelector)));

  const extButton = chromeDriver.findElement(By.css(chromeExtensionsRevealButtonSelector));

  await (extButton.click());

  // grab list of extensions
  const extensionList = chromeDriver.wait(until.elementLocated(By.css(chromeExtensionsListNodeSelector)));

  extensionList.getText().then(async (list) => {
    if (list) {
      // there's a hash at the end of each list item which we remove via the filter
      // we also remove any default chrome extensions
      const extensions = list.split(' : ').filter((item, index) => index%2 == 1 && !item.includes('Chrome') && !item.includes('Web Store'));
      
      console.log(`-----------------------------`);
      console.log(`-----------------------------`);
      console.log(`${extensions.length} Extensions Found! Now updating Firefox`);
      console.log(`-----------------------------`);
      console.log(`-----------------------------`);

      const driver = new Builder().forBrowser('firefox').build();
      for (let i = 0; i < extensions.length; i++) {
        let ext = extensions[i];

        await driver.get(searchText(ext));
        // either wait for the results to load or wait until the message that no results
        // exist loads
        await driver.wait(until.elementLocated(By.css(`${firstSearchResultNodeSelector}, ${noResultsNodeSelector}`)));
        
        // if the no results message comes up jump to the next one
        try {
          // check if no results exists and if it does continue to next iteration
          await driver.findElement(By.css(noResultsNodeSelector));
          console.log(`-----------------------------`);
          console.log(`No results found for ${ext}`);
          console.log(`-----------------------------`);
          failedAddOns.push(ext);
          continue;
        } catch (e) {
          // console.log(`Results found for ${ext}`);
        }

        let result, button;
        try {
          result = driver.findElement(By.linkText(ext));
          await (result.click());

          button = driver.findElement(By.css(firefoxInstallButton));
          button = await driver.wait(until.elementIsVisible(button), 1000);
          await (button.click());
          foundAddOns += 1;

          // Give user time to approve extension
          await (driver.sleep(6000));
          continue;
        } catch (e) {
          console.log(`-----------------------------`);
          console.log(`---No exact match was found for ${ext}---`);
          console.log(`---Installing first result---`);
          console.log(`-----------------------------`);
        }

        result = driver.findElement(By.css(firstSearchResultNodeSelector));
        await (result.click());

        button = driver.findElement(By.css(firefoxInstallButton));
        await driver.wait(until.elementIsVisible(button), 1000);
        const newAddonName = await driver.getTitle();

        await (button.click());
        convertedAddons.push(`${ext} ==> ${newAddonName.split(`–`)[0]}`);
        foundAddOns += 1;
        // Give user time to approve extension
        await (driver.sleep(6000));
      }
      console.log(`-----------------------------`);
      console.log(`-----------------------------`);
      console.log(`${foundAddOns} Addon's Found`);
      console.log(`-----------------------------`);
      console.log(`-----------------------------`);

      console.log(`-----------------------------`);
      console.log(`-----------------------------`);
      console.log(`Addon's converted:`);
      console.log(`${convertedAddons.join('\n')}`);
      console.log(`-----------------------------`);
      console.log(`-----------------------------`);

      console.log(`-----------------------------`);
      console.log(`-----------------------------`);
      console.log(`Addon's not found:`);
      console.log(`${failedAddOns.join('\n')}`);
      console.log(`-----------------------------`);
      console.log(`-----------------------------`);

    } else {
      console.log(`-----------------------------`);
      console.log(`-----------------------------`);
      console.log(`No Addon's found`);
      console.log(`-----------------------------`);
      console.log(`-----------------------------`);
    }
  });
})();