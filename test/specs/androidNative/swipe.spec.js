import { remote } from 'webdriverio';
import fs from "fs";
import { BS_USERNAME, BS_ACCESS_KEY } from "../../../config.js";

const capabilities = {
    "platformName": "android",
    "appium:platformVersion": "13.0", // Adjusted to a more common version
    "appium:deviceName": "Google Pixel 6", // More standard device name
    "appium:automationName": "UiAutomator2", // Corrected capitalization
    "appium:app": "bs://da6fc9b93a5c2c49aeff56047dc3e4828f371eab",
    'bstack:options': {
        "userName": BS_USERNAME, 
        "accessKey": BS_ACCESS_KEY, 
        "appiumVersion": "2.0.1", // Use a stable version
        "debug": true, // Boolean instead of string
        "networkLogs": true,
        "video": true
    }
};

const wdOpts = {
    hostname: 'hub.browserstack.com',
    port: 4444,
    path: '/wd/hub',
    connectionRetryTimeout: 120000, // Added timeout
    connectionRetryCount: 3,
    capabilities,
    logLevel: 'info' // Changed from debug
};

async function runTest() {
    let driver;
    try {
        // Create driver instance
        driver = await remote(wdOpts);

        // Wait for app to load
        await driver.pause(5000);

        // Find and click Australia/English language
        const australiaLanguage = await driver.$(
            `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().text("Australia/English"))`
        );
        await australiaLanguage.waitForExists({ timeout: 10000 });
        await australiaLanguage.click();

        // Accept cookies
        const acceptCookiesBtn = await driver.$(`id:com.hm.goe:id/btn_accept_cookies`);
        await acceptCookiesBtn.waitForExists({ timeout: 10000 });
        await acceptCookiesBtn.click();

        // Handle potential popup
        try {
            await driver.$('id:android:id/button2').click();
        } catch (error) {
            console.log('No additional popup found');
        }

        // Scroll to find specific element
        const lastEle = await driver.$('//android.widget.TextView[@resource-id="com.hm.goe:id/banner_container_title" and contains(@text,"60 day returns on purchases made until")]');
        
        // Get window size for scrolling
        const { width, height } = await driver.getWindowSize();
        const startHeight = height * 0.8;
        const endHeight = height * 0.2;
        const scrollWidth = width / 2;

        // Custom scroll method
        const maxAttempts = 5;
        let elementFound = false;

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            try {
                // Wait for element with a shorter timeout
                await lastEle.waitForExists({ timeout: 2000 });
                elementFound = true;
                break;
            } catch {
                // Perform scroll
                await driver.performActions([
                    {
                        type: 'pointer',
                        id: 'finger1',
                        parameters: { pointerType: 'touch' },
                        actions: [
                            { type: 'pointerMove', duration: 0, x: scrollWidth, y: startHeight },
                            { type: 'pointerDown', button: 0 },
                            { type: 'pointerMove', duration: 500, x: scrollWidth, y: endHeight },
                            { type: 'pointerUp', button: 0 },
                        ],
                    },
                ]);
                await driver.pause(1000);
            }
        }

        // Click on the element if found
        if (elementFound) {
            await lastEle.click();
        } else {
            throw new Error(`Element not found after ${maxAttempts} scroll attempts`);
        }

        // Additional wait
        await driver.pause(5000);

    } catch (error) {
        console.error('Test execution failed:', error);
        // Take screenshot on failure
        if (driver) {
            const screenshot = await driver.takeScreenshot();
            fs.writeFileSync('error_screenshot.png', screenshot, 'base64');
        }
    } finally {
        // Ensure driver is closed
        if (driver) {
            await driver.deleteSession();
        }
    }
}

// Execute the test
runTest().catch(console.error);