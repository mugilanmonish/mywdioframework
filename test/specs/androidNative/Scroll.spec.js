import { remote } from 'webdriverio';
import fs from "fs";
import { BS_USERNAME, BS_ACCESS_KEY } from "../../../config.js";

// const capabilities = {
//     platformName: 'Android',
//     'appium:automationName': 'UiAutomator2',
//     'appium:deviceName': 'Android',
//     'appium:appPackage': 'com.hm.goe',
//     'appium:appActivity': '.app.home.HomeActivity',
// };

var capabilities = {
    "platformName": "android",
    "appium:platformVersion": "15.0",
    "appium:deviceName": "Google Pixel 9 Pro XL",
    "appium:automationName": "UIAutomator2",
    "appium:app": "bs://da6fc9b93a5c2c49aeff56047dc3e4828f371eab",
    'bstack:options': {
        "userName": "mugilanmonish_1YtIFG",
        "accessKey": "PgXqrrdMvXnv6d7yvCNM",
        "appiumVersion": "2.6.0",
        "debug": "true",
    }
}


const wdOpts = {
    hostname: 'hub.browserstack.com',
    port: 4444,
    path: '/wd/hub',
    services: ['browserstack'],
    logLevel: 'debug',
    capabilities,
};

async function runTest() {
    const driver = await remote(wdOpts);
    const australiaLanguage = await driver.$(`android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().text("Australia/English"))`)
    await australiaLanguage.click()
    const acceptCokkiesBtn = await driver.$(`id:com.hm.goe:id/btn_accept_cookies`)
    await acceptCokkiesBtn.click()
    await driver.$('id:android:id/button2').click()
    const lastEle = await driver.$('//android.widget.TextView[@resource-id="com.hm.goe:id/banner_container_title" and contains(@text,"60 day returns on purchases made until")]')
    // await driver.startRecordingScreen()
    const maxScroll = 10
    let isElementDisplayed = false
    const size = await driver.getWindowRect()
    const startHeight = (size.height) / 7
    console.log(`Start Height ${startHeight}`);
    const endHeight = (size.height) * .9
    console.log(`End height ${endHeight}`);
    const width = (size.width) / 2
    console.log(`Width ${width}`);
    for (let i = 0; i < maxScroll; i++) {
        if (await lastEle.isDisplayed()) {
            isElementDisplayed = true;
            break;
        }

        await driver.performActions([
            {
                type: 'pointer',
                id: 'finger1',
                parameters: { pointerType: 'touch' },
                actions: [
                    { type: 'pointerMove', duration: 0, x: width, y: endHeight },
                    { type: 'pointerDown', button: 0 },
                    { type: 'pointerMove', duration: 1000, x: width, y: startHeight },
                    { type: 'pointerUp', button: 0 },
                ],
            },
        ]);
        await driver.pause(500);
    }

    if (isElementDisplayed === true)
        await lastEle.click()
    else
        throw new Error(`Element not found after ${maxScroll} scrolling`)

    await driver.pause(5000)
    // const video = await driver.stopRecordingScreen()
    // fs.writeFileSync('scroll_video.mp4', Buffer.from(video,'base64'))
}
runTest()