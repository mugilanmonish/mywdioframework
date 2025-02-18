import fs from 'fs';
import path from 'path'
import allure from 'allure-commandline';
import mwebCapabilities from "./genricUtility/mwebCapabilities.js";
import apiUtility from './genricUtility/apiUtility.js';
import { BS_USERNAME, BS_ACCESS_KEY } from "./config.js";
const selectedBrowser = process.env.BROWSER_NAME || 'chrome'
const ENV = process.env.ENV || 'prod';
const urls = {
    dev: 'https://www.amazon.in/',
    qa: 'http://localhost:4050',
    prod: 'https://www.redbus.in/'
};
if (!urls[ENV]) {
    throw new Error(`Environment ${ENV} is not defined. Please use 'dev', 'qa', or 'prod'.`);
}

export const config = {
    runner: 'local',
    specs: ['./test/specs/**/*.js'],
    suites: {
        smoke: ['./test/specs/**/*.spec.js']
    },
    exclude: [],
    maxInstances: 1,
    user: process.env.BROWSERSTACK === 'true' ? BS_USERNAME : undefined,
    key: process.env.BROWSERSTACK === 'true' ? BS_ACCESS_KEY : undefined,
    capabilities: process.env.BROWSERSTACK === 'true' ? [
        (() => {
            switch (selectedBrowser) {
                case 'chrome':
                    return mwebCapabilities.chromeBrowserstack;
                case 'safari':
                    return mwebCapabilities.safariBrowserstack;
                default:
                    throw new Error('Unsupported browser');
            }
        })(),
    ] : [
        (() => {
            switch (selectedBrowser) {
                case 'chrome':
                    return mwebCapabilities.chromeLocal;
                case 'safari':
                    return mwebCapabilities.safariLocal;
                default:
                    throw new Error('Unsupported browser');
            }
        })(),
    ],

    logLevel: 'info',
    outputDir: './logs/Wdio_Log',
    bail: 0,
    baseUrl: urls[ENV],
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    services: process.env.BROWSERSTACK === 'true' ? [
        [
            'browserstack',
            {
                browserstackLocal: false
            }
        ]
    ] : [
        [
            'appium',
            {
                logPath: './logs/Appium_Log',
                appiumArgs: ['--log-level', 'info']
            }
        ]
    ],

    reporters: [
        'spec',
        ['allure', {
            outputDir: 'allure-results',
            disableWebdriverStepsReporting: true,
            disableWebdriverScreenshotsReporting: false,
        }]
    ],
    framework: 'mocha',
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000,
        retries: 0,
        grep: ''
    },
    onPrepare: function (config, capabilities) {
        const allureResultsDir = path.join(process.cwd(), 'allure-results');
        fs.rm(allureResultsDir, { recursive: true, force: true }, (err) => {
            if (err) {
                console.error('Could not remove allure-results:', err);
            } else {
                console.log('Cleaned up allure-results directory');
            }
        });
    },
   
    beforeTest: async function (test, context) {
        if (process.env.BROWSER_NAME === 'safari') {
            const contexts = await browser.getContexts(); // Explicitly type contexts as string[]
            console.log('Available contexts:', contexts);
            const webviewContext = contexts.find((context) => context.includes('WEBVIEW')); // Type as string or undefined
            if (!webviewContext) {
                throw new Error('WebView context not found!');
            }
            await browser.switchContext(webviewContext);
            console.log("Switched to context: " + webviewContext);
            const currentContext = await browser.getContext();
            console.log('Current Context:', currentContext);
            const url = await urls[ENV]
            await browser.execute((url) => { window.location.href = `${url}`; }, url);
        } else if (process.env.BROWSER_NAME === 'chrome') {
            await browser.url('./')
        }
        // if (process.env.BROWSER_NAME === 'safari') {
        //     await browser.waitUntil(async () => (await browser.execute(() => document.readyState)) === 'complete',
        //         {
        //             timeout: 10000,
        //             timeoutMsg: 'Page did not load completely within 10 seconds',
        //         }
        //     )
        //     await browser.pause(10000)
        // }
    },
 
    afterTest: async function (test, context, { error, result, duration, passed, retries }) {
        if (process.env.BROWSERSTACK === 'true') {
            var publicUrl = await apiUtility.getBrowserstackPublicLink()
            console.log(`BS Public Url -> ${publicUrl}`);
        }
        await browser.deleteAllCookies()
        if (error) {
            await browser.takeScreenshot();
        }
    },

    onComplete: function (exitCode, config, capabilities, results) {
        const reportError = new Error('Could not generate Allure report')
        const now = new Date();
        const timestamp = `${now.getDate()}-${(now.getMonth() + 1)}-${now.getFullYear()}_${now.getHours()}-${now.getMinutes()}`;
        const reportDir = path.join('MWeb_Execution_Report', `Report_${timestamp}`);
        const reportFile = (process.env.BROWSERSTACK === 'true' ? `MWeb_BS_Report_${timestamp}.html` : `MWeb_Local_Report_${timestamp}.html`)
        const generation = allure(['generate', '--single-file', 'allure-results', '--clean', '--output', reportDir])
        return new Promise((resolve, reject) => {
            const generationTimeout = setTimeout(
                () => reject(reportError),
                150000)

            generation.on('exit', function (exitCode) {
                clearTimeout(generationTimeout)

                if (exitCode !== 0) {
                    return reject(reportError)
                }
                const oldPath = path.join(reportDir, 'index.html');
                const newPath = path.join(reportDir, reportFile);
                fs.rename(oldPath, newPath, (err) => {
                    if (err) {
                        return reject(new Error('Could not rename the Allure report file.'));
                    }
                    console.log('Allure report successfully generated')
                    resolve()
                })
            })
        })
    }
}
