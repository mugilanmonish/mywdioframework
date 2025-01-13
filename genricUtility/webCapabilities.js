import { BS_USERNAME, BS_ACCESS_KEY } from './../config.js';

const chromeLocal = {
    browserName: 'chrome',
    browserVersion: process.env.BROWSER_VERSION !== null ? process.env.BROWSER_VERSION : 'latest',
    'goog:chromeOptions': {
        // mobileEmulation: { deviceName: 'Pixel 2' },
        // args: [
        //     '--headless',               // Run in headless mode
        // //     '--no-sandbox',             // Disable sandboxing (required in Docker)
        // //     '--disable-dev-shm-usage',  // Overcomes issue with /dev/shm in Docker
        // //     '--disable-blink-features=AutomationControlled',  // Avoid detection of WebDriver
        // ],
        prefs: {
            'profile.default_content_setting_values.notifications': 2, // 2 means block notifications
        }
    }
}

const firefoxLocal = {
    browserName: 'firefox',
    browserVersion: process.env.BROWSER_VERSION !== null ? process.env.BROWSER_VERSION : 'latest',
    'moz:firefoxOptions': process.env.DOCKER === 'true' ? {
        args: ['-headless']
    } : {}
}

const safariLocal = {
    browserName: 'safari',
    browserVersion: process.env.BROWSER_VERSION !== null ? process.env.BROWSER_VERSION : 'latest'
}

const chromeBrowserstack = {
    browserName: 'chrome',
    'goog:chromeOptions': {
        w3c: false,
        prefs: {
            'profile.default_content_setting_values.notifications': 2, // 2 means block notifications
        }
    },
    'bstack:options': {
        "browserVersion": process.env.BROWSER_VERSION || 'latest',
        "os": 'Windows',
        "osVersion": '11',
        "userName": BS_USERNAME,
        "accessKey": BS_ACCESS_KEY,
    }
}

const firefoxBrowserstack = {
    browserName: 'firefox',
    browserVersion: "latest",
    'bstack:options': {
        os: process.env.BROWSER_VERSION || 'Windows',
        osVersion: process.env.OS_VERSION || '11',
        userName: BS_USERNAME,
        accessKey: BS_ACCESS_KEY
    },
    'moz:firefoxOptions': {
        prefs: {
            'dom.webnotifications.enabled': false, // Disable notifications
        },
    },
}

const safariBrowserstack = {
    maxInstances: 2,
    browserName: 'Safari',
    'bstack:options': {
        "browserVersion": "latest",
        "os": 'OS X',
        "osVersion": process.env.OS_VERSION || 'Monterey',
        "userName": BS_USERNAME,
        "accessKey": BS_ACCESS_KEY
    },
}

const capabilities = {
    chromeLocal,
    firefoxLocal,
    safariLocal,
    chromeBrowserstack,
    firefoxBrowserstack,
    safariBrowserstack
};

export default capabilities;
