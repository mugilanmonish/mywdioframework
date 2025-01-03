import fs from 'fs';
import path from 'path'
import allure from 'allure-commandline';
import { BS_USERNAME, BS_ACCESS_KEY } from "./config.js";
import androidCapabilities from "./genricUtility/mwebCapabilities.js";
const selectedBrowser = process.env.BROWSER_NAME || 'chrome'


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

    capabilities: [
        process.env.BROWSERSTACK === 'true'
            // ? {
            //     // BrowserStack capabilities
            //     platformName: 'Android',
            //     'appium:deviceName': 'Google Pixel 4',
            //     'appium:platformVersion': '11.0',
            //     'appium:automationName': 'UiAutomator2',
            //     'appium:app': 'bs://da6fc9b93a5c2c49aeff56047dc3e4828f371eab',
            //     'appium:autoGrantPermissions': true,
            //     'bstack:options': {
            //         userName: BS_USERNAME,
            //         accessKey: BS_ACCESS_KEY,
            //         projectName: 'My Android App Project',
            //         buildName: 'Android Local and BrowserStack Test',
            //         sessionName: 'WebdriverIO Android Native App Test',
            //     },
            // }
            ? {
                'bstack:options': {
                    projectName: "NF",
                    debug: true,
                    networkLogs: true,
                    appiumVersion: "2.4.1",
                    idleTimeout: process.env.IDEL_TIME,
                    proxyHost: 'proxy-host',
                    proxyPort: 8080, 
                    local: true,
                },
                "platformName": 'android',
                "appium:platformVersion": process.env.PLATFORM_VERSION,
                "appium:deviceName": "Google Pixel 4",
                'appium:app': 'bs://da6fc9b93a5c2c49aeff56047dc3e4828f371eab',
                "appium:otherApps": [],
                "appium:unicodeKeyboard": true,
                "appium:resetKeyboard": true,
                'browserstack:hideKeyboard': true,
            }
            //   : {
            //       // Local capabilities
            //       platformName: 'Android',
            //       'appium:deviceName': 'Android Emulator', // Change to your local device/emulator name
            //       'appium:platformVersion': '15.0', // Specify your Android version
            //       'appium:automationName': 'UiAutomator2',
            //       'appium:appPackage': 'com.snc.test.webview2', // Path to the APK file
            //       'appium:appActivity': 'com.snc.test.webview.activity.MainActivity',
            //       'appium:autoGrantPermissions': true,
            //     },
            : {
                "platformName": "Android",
                "appium:automationName": "UiAutomator2",

                "appium:appPackage": "com.snc.test.webview2",
                "appium:appActivity": "com.snc.test.webview.activity.MainActivity",
                "appium:autoGrantPermissions": true,
            },
    ],

    // Services setup
    services: process.env.BROWSERSTACK === 'true' ? [
        ['browserstack', {
            browserstack: true
        }]
    ] : [
        ['appium',
            {
                args: {
                    relaxedSecurity: true,
                },
                logPath: 'log_appium.log'
            }
        ]
    ],

    logLevel: 'info',
    bail: 0,
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    // services: process.env.BROWSERSTACK === 'true' ? [['browserstack', {
    //     browserstackLocal: false,
    // }]] : [
    //     ['appium',
    //         {
    //             args: {
    //                 relaxedSecurity: true,
    //             },
    //             chromedriver: {
    //                 autoDownload: true,
    //             },
    //             logPath: 'log_appium.log'
    //         }
    //     ]
    // ],

    // see also: https://webdriver.io/docs/frameworks
    reporters: ['spec',
        ['allure', {
            outputDir: 'allure-results',
            disableWebdriverStepsReporting: true,
            disableWebdriverScreenshotsReporting: false,
        }]
    ],
    // Options to be passed to Mocha.
    // See the full list at http://mochajs.org/
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
    // beforeTest: async function (test, context) {
    // },
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
        const now = new Date();
        const reportError = new Error('Could not generate Allure report')
        const timeStamp = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}_${now.getHours()}-${now.getMinutes()}`
        const outputDir = 'Reports_Android'
        const tempDir = path.join('allure-temp');
        fs.mkdirSync(tempDir, { recursive: true });
        const generation = allure(['generate', 'allure-results', '--clean', '--single-file', '-o', tempDir])
        return new Promise((resolve, reject) => {
            const generationTimeout = setTimeout(() => reject(reportError), 5000)
            generation.on('exit', function (exitCode) {
                clearTimeout(generationTimeout)
                if (exitCode !== 0) {
                    return reject(reportError)
                }
                fs.mkdirSync(outputDir, { recursive: true });
                const oldPath = path.join(tempDir, 'index.html');
                const newPath = path.join(outputDir, `Android_Report_${timeStamp}.html`);
                fs.rename(oldPath, newPath, (err) => {
                    if (err) {
                        return reject(new Error('Could not rename report file'));
                    }
                    console.log(`Allure report successfully generated ${newPath}`)
                    fs.rm(tempDir, { recursive: true, force: true }, (err) => {
                        if (err) {
                            console.error('Could not remove temporary directory:', err);
                        }
                        resolve()
                    })
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
