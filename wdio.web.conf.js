import path from 'path';
import fs from 'fs';
import allure from "allure-commandline";
import webCapabilities from "./genricUtility/webCapabilities.js";
import report from "./genricUtility/allureUtility.js";
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
    user: process.env.BROWSERSTACK === 'true' ? BS_USERNAME : undefined,
    key: process.env.BROWSERSTACK === 'true' ? BS_ACCESS_KEY : undefined,
    runner: 'local',
    specs: ['./test/specs/**/*.js'],
    suites: {
        smoke: ['./test/specs/web/*.spec.js']
    },
    exclude: [],
    maxInstances: 2,
    capabilities: process.env.BROWSERSTACK === 'true' ? [
        (() => {
            switch (selectedBrowser) {
                case 'chrome':
                    return webCapabilities.chromeBrowserstack;
                case 'firefox':
                    return webCapabilities.firefoxBrowserstack;
                case 'safari':
                    return webCapabilities.safariBrowserstack;
                default:
                    throw new Error('Unsupported browser');
            }
        })(),
    ] : [
        (() => {
            switch (selectedBrowser) {
                case 'chrome':
                    return webCapabilities.chromeLocal;
                case 'firefox':
                    return webCapabilities.firefoxLocal;
                case 'safari':
                    return webCapabilities.safariLocal;
                default:
                    throw new Error('Unsupported browser');
            }
        })(),
    ],
    logLevel: 'info',
    bail: 0,
    baseUrl: urls[ENV],
    waitforTimeout: 15000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    outputDir: './logs/Wdio_Log',
    services: process.env.BROWSERSTACK === 'true' ?
        [
            [
                'browserstack',
                {
                    browserstackLocal: false
                }
            ]
        ] : [],

    reporters: ['spec',
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
        await browser.maximizeWindow()
        await browser.url('./')
        await report.addLink(await urls[ENV], 'Redbus')
    },

    afterTest: async function (test, context, { error, result, duration, passed, retries }) {
        
        if (error) {
            await browser.takeScreenshot();
        }
        await browser.execute(() => {
            window.localStorage.clear();
            window.sessionStorage.clear();
        });
    },

    onComplete: function (exitCode, config, capabilities, results) {
        const reportError = new Error('Could not generate Allure report')
        const now = new Date();
        const timestamp = `${now.getDate()}-${(now.getMonth() + 1)}-${now.getFullYear()}_${now.getHours()}-${now.getMinutes()}`;
        const reportDir = path.join('Web_Execution_Report', `Report_${timestamp}`);
        const reportFile = (process.env.BROWSERSTACK === 'true' ? `Web_BS_Report_${timestamp}.html` : `Web_Local_Report_${timestamp}.html`)
        const generation = allure(['generate', '--single-file', 'allure-results', '--clean', '--output', reportDir])
        return new Promise((resolve, reject) => {
            const generationTimeout = setTimeout(
                () => reject(reportError),
                15000)

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