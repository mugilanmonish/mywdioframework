import fs from 'fs';
import path from 'path'
import allure from 'allure-commandline';
import { BS_USERNAME, BS_ACCESS_KEY } from "./config.js";
import androidCapabilities from "./genricUtility/androidCapabilities.js";
import apiUtility from './genricUtility/apiUtility.js';


export const config = {
    runner: 'local',
    specs: ['./test/specs/**/*.js'],
    suites: {
        smoke: ['./test/specs/**/*.spec.js']
    },

    exclude: [],
    hostname: 'hub.browserstack.com',
    maxInstances: 1,
    user: process.env.BROWSERSTACK === 'true' ? BS_USERNAME : undefined,
    key: process.env.BROWSERSTACK === 'true' ? BS_ACCESS_KEY : undefined,

    capabilities: process.env.BROWSERSTACK === 'true'
        ? [androidCapabilities.browserstack]
        : [androidCapabilities.localDevice],

    services: process.env.BROWSERSTACK === 'true' ? 
    [
        ['browserstack', {
            browserstack: true
        }]
    ] : [
        ['appium']
    ],

    logLevel: 'info',
    bail: 0,
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,

    // see also: https://webdriver.io/docs/frameworks
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

    onPrepare: async function (config, capabilities) {
        const allureResultsDir = path.join(process.cwd(), 'allure-results');
        fs.rm(allureResultsDir, { recursive: true, force: true }, (err) => {
            if (err) {
                console.error('Could not remove allure-results:', err);
            } else {
                console.log('Cleaned up allure-results directory');
            }
        });
    },

    afterTest: async function (test, context, { error, result, duration, passed, retries }) {
        if (error) {
            await browser.takeScreenshot();
        }
        if (process.env.BROWSERSTACK === 'true') {
            let publicUrl = await apiUtility.getBrowserstackPublicLink('app-automate')
            console.log(`BS Public Url -> ${publicUrl}`);
        }
    },

    onComplete: function (exitCode, config, capabilities, results) {
        try {
            const reportError = new Error('Could not generate Allure report')
            const now = new Date();
            const timestamp = `${now.getDate()}-${(now.getMonth() + 1)}-${now.getFullYear()}_${now.getHours()}-${now.getMinutes()}`;
            const reportDir = path.join('Android_Execution_Report', `Report_${timestamp}`);
            const reportFile = (process.env.BROWSERSTACK === 'true' ? `Android_BS_Report_${timestamp}.html` : `Android_Local_Report_${timestamp}.html`)
            const generation = allure(['generate', '--single-file', 'allure-results', '--clean', '--output', reportDir])
            return new Promise((resolve, reject) => {
                const generationTimeout = setTimeout(
                    () => reject(reportError), 150000)
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
        } catch (error) {
            console.log(`Allure report is not generated ${error.message}`);
        }
    }
}
