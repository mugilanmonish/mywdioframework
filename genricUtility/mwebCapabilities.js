import { BS_USERNAME, BS_ACCESS_KEY } from './../config.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const chromeLocal = {
    platformName: 'Android',
    browserName: 'Chrome',
    'appium:automationName': 'UiAutomator2',
    'appium:chromedriverExecutable': path.resolve(__dirname, './driver/chromedriver.exe'),
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