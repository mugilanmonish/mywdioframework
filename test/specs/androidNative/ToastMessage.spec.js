// import { remote } from 'webdriverio';

// const capabilities = {
//   platformName: 'Android',
//   'appium:automationName': 'UiAutomator2',
//   'appium:deviceName': 'Android',
//   'appium:appPackage': 'com.coloros.alarmclock',
//   'appium:appActivity': 'com.oplus.alarmclock.AlarmClock',
// };

// const wdOpts = {
//   hostname: process.env.APPIUM_HOST || 'localhost',
//   port: parseInt(process.env.APPIUM_PORT, 10) || 4723,
//   logLevel: 'info',
//   capabilities,
// };

// async function runTest() {
//   const driver = await remote(wdOpts);
//   try {
//     await driver.$(`android=new UiSelector().resourceId("com.coloros.alarmclock:id/alarm_switch").instance(1)`).click()
//     // await driver.pause(800)
//     const toastMessage = await driver.$('//android.widget.Toast').getText()
//     console.log(`$$$ToastMessage ${toastMessage}`);
//     // const logs = await driver.getLogs('logcat');
//     // Filter logs for Toast messages (if desired)
//     // const toastLogs = logs.filter(log => log.message.includes('Toast'));
//     // Print the filtered logs
//     // console.log('Toast Logs:', toastLogs);
//   } finally {
//     await driver.pause(4000);
//     await driver.deleteSession();
//   }
// }

// runTest().catch(console.error);