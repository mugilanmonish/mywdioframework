import { BS_USERNAME, BS_ACCESS_KEY } from './../config.js';
import path from "path";
import apiUtility from "../genricUtility/apiUtility.js";

let appPath = ''

async function setAppPath() {
    let apkPath = '';
    if (process.env.APP === 'anilab') {
        apkPath = path.resolve(process.cwd(), 'app/android/anilab.apk');
    } else {
        apkPath = path.resolve(process.cwd(), 'app/android/myntra.apk');
    }

    if (process.env.BROWSERSTACK === 'true') {
        appPath = await apiUtility.uploadApk(apkPath);
    } else {
        appPath = apkPath;
    }
}

// Call the function before exporting
await setAppPath();

/**
 * @description This capability for local device and emulator
 */
const localDevice = {
    "platformName": "Android",
    "appium:automationName": "UiAutomator2",
    'appium:app': appPath,
    "appium:autoGrantPermissions": true,
    "appium:noReset": true,
    "appium:fullReset": false
}


const browserstack = {
    "platformName": "android",
    "appium:automationName": "UiAutomator2",
    "appium:platformVersion": process.env.ANDROID_VERSION || "12.0",
    "appium:deviceName": process.env.MOBILE_MODEL || "Samsung Galaxy S22 Ultra",
    "appium:app": appPath,
    'bstack:options': {
        "userName": BS_USERNAME,
        "accessKey": BS_ACCESS_KEY,
        "appiumVersion": "2.12.1",
        "debug": "true",
        "networkLogs": "true",
        projectName: 'My Android App Project',
        buildName: 'Android Local and BrowserStack Test',
        sessionName: 'WebdriverIO Android Native App Test',
    }
}

const capabilities = {
    localDevice,
    browserstack
};

export default capabilities;