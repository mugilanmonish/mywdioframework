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
                args: {
                    relaxedSecurity: true,
                },
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
    /**
     * Gets executed once before all workers get launched.
     * @param {object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     */
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
    /**
     * Gets executed before a worker process is spawned and can be used to initialize specific service
     * for that worker as well as modify runtime environments in an async fashion.
     * @param  {string} cid      capability id (e.g 0-0)
     * @param  {object} caps     object containing capabilities for session that will be spawn in the worker
     * @param  {object} specs    specs to be run in the worker process
     * @param  {object} args     object that will be merged with the main configuration once worker is initialized
     * @param  {object} execArgv list of string arguments passed to the worker process
     */
    // onWorkerStart: function (cid, caps, specs, args, execArgv) {
    // },
    /**
     * Gets executed just after a worker process has exited.
     * @param  {string} cid      capability id (e.g 0-0)
     * @param  {number} exitCode 0 - success, 1 - fail
     * @param  {object} specs    specs to be run in the worker process
     * @param  {number} retries  number of retries used
     */
    // onWorkerEnd: function (cid, exitCode, specs, retries) {
    // },
    /**
     * Gets executed just before initialising the webdriver session and test framework. It allows you
     * to manipulate configurations depending on the capability or spec.
     * @param {object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that are to be run
     * @param {string} cid worker id (e.g. 0-0)
     */
    // beforeSession: function (config, capabilities, specs, cid) {
    // },
    /**
     * Gets executed before test execution begins. At this point you can access to all global
     * variables like `browser`. It is the perfect place to define custom commands.
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs        List of spec file paths that are to be run
     * @param {object}         browser      instance of created browser/device session
     */
    // before:async function (capabilities, specs) {
    // },
    /**
     * Runs before a WebdriverIO command gets executed.
     * @param {string} commandName hook command name
     * @param {Array} args arguments that command would receive
     */
    // beforeCommand: function (commandName, args) {
    // },
    /**
     * Hook that gets executed before the suite starts
     * @param {object} suite suite details
     */
    // beforeSuite: function (suite) {
    // },
    /**
     * Function to be executed before a test (in Mocha/Jasmine) starts.
     */
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
    /**
     * Hook that gets executed _before_ a hook within the suite starts (e.g. runs before calling
     * beforeEach in Mocha)
     */
    // beforeHook: function (test, context, hookName) {
    // },
    /**
     * Hook that gets executed _after_ a hook within the suite starts (e.g. runs after calling
     * afterEach in Mocha)
     */
    // afterHook: function (test, context, { error, result, duration, passed, retries }, hookName) {
    // },
    /**
     * Function to be executed after a test (in Mocha/Jasmine only)
     * @param {object}  test             test object
     * @param {object}  context          scope object the test was executed with
     * @param {Error}   result.error     error object in case the test fails, otherwise `undefined`
     * @param {*}       result.result    return object of test function
     * @param {number}  result.duration  duration of test
     * @param {boolean} result.passed    true if test has passed, otherwise false
     * @param {object}  result.retries   information about spec related retries, e.g. `{ attempts: 0, limit: 0 }`
     */
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
    /**
     * Hook that gets executed after the suite has ended
     * @param {object} suite suite details
     */
    // afterSuite: function (suite) {
    // },
    /**
     * Runs after a WebdriverIO command gets executed
     * @param {string} commandName hook command name
     * @param {Array} args arguments that command would receive
     * @param {number} result 0 - command success, 1 - command error
     * @param {object} error error object if any
     */
    // afterCommand: function (commandName, args, result, error) {
    // },
    /**
     * Gets executed after all tests are done. You still have access to all global variables from
     * the test.
     * @param {number} result 0 - test pass, 1 - test fail
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that ran
     */
    // after: function (result, capabilities, specs) {
    // },
    /**
     * Gets executed right after terminating the webdriver session.
     * @param {object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that ran
     */
    // afterSession: function (config, capabilities, specs) {
    // },
    /**
     * Gets executed after all workers got shut down and the process is about to exit. An error
     * thrown in the onComplete hook will result in the test run failing.
     * @param {object} exitCode 0 - success, 1 - fail
     * @param {object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {<Object>} results object containing test results
     */
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

    /**
    * Gets executed when a refresh happens.
    * @param {string} oldSessionId session ID of the old session
    * @param {string} newSessionId session ID of the new session
    */
    // onReload: function(oldSessionId, newSessionId) {
    // }
    /**
    * Hook that gets executed before a WebdriverIO assertion happens.
    * @param {object} params information about the assertion to be executed
    */
    // beforeAssertion: function(params) {
    // }
    /**
    * Hook that gets executed after a WebdriverIO assertion happened.
    * @param {object} params information about the assertion that was executed, including its results
    */
    // afterAssertion: function(params) {
    // }
}
