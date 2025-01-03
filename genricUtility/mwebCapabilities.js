import { BS_USERNAME, BS_ACCESS_KEY } from './../config.js';

const chromeLocal = {
    platformName: 'Android',
    browserName: 'Chrome',
    'appium:automationName': 'UiAutomator2',
    'appium:chromedriverAutodownload': true,
    'appium:noReset': true,
    'appium:fullReset': false
}

const safariLocal = {
    
}

const chromeBrowserstack = {
    'browserName': 'Chrome',
    'bstack:options': {
        os: 'android',
        osVersion: '14.0',
        deviceName: process.env.DEVICE_NAME,
        realMobile: true,
        userName: BS_USERNAME,
        accessKey: BS_ACCESS_KEY,
        appiumVersion: "2.6.0",
        debug: "true",
        // interactiveDebugging : true,
    },
    'appium:chromedriverAutodownload': true,
    "appium:unicodeKeyboard": true,
    "appium:resetKeyboard": true
}

const safariBrowserstack = {
    browserName: "safari",
    'bstack:options': {
        os: 'iOS',
        osVersion: '15',
        deviceName: process.env.DEVICE_NAME,
        realMobile: true,
        userName: BS_USERNAME,
        accessKey: BS_ACCESS_KEY,
        appiumVersion: "2.6.0",
        debug: "true",
        networkLogs: "true",
        // interactiveDebugging : true
    }
}

const capabilities = {
    chromeLocal,
    chromeBrowserstack,
    safariLocal,
    safariBrowserstack
};

export default capabilities;