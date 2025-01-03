import { remote } from 'webdriverio';
import { expect } from "chai";
const capabilities = {
  platformName: 'Android',
  'appium:automationName': 'UiAutomator2',
  'appium:deviceName': 'Android',
  'appium:appPackage': 'com.artcode.prakrutiparikshan',
  'appium:appActivity': '.MainActivity',
};

const wdOpts = {
  hostname: process.env.APPIUM_HOST || 'localhost',
  port: parseInt(process.env.APPIUM_PORT, 10) || 4723,
  logLevel: 'info',
  capabilities,
};

async function runTest() {
  const driver = await remote(wdOpts);
  try {
    // Step 1: Click on the "Citizen" element
    await driver.$(`android=new UiSelector().text("Citizen")`).click()

    // Step 2: Wait for the "Send OTP" button and ensure it's disabled initially
    let sendOtpBtn = await driver.$(`accessibility id:Send OTP`)
    expect(await sendOtpBtn.isEnabled()).to.be.false

    // Step 3: Enter the mobile number
    await driver.$(`//android.view.ViewGroup[@content-desc="Send OTP"]/preceding-sibling::android.view.ViewGroup/child::android.widget.EditText`).setValue('7708084971')
    
    // Step 4: Enable and click the "Send OTP" button
    expect(await sendOtpBtn.isEnabled()).to.be.true
    await sendOtpBtn.click()
    
    // let toastMessage = await driver.$('//android.widget.Toast[contains(@text,"OTP")]')
    // expect(await toastMessage.getText()).equal("OTP sent successfully")

    // Step 5: Open notifications to wait for the OTP message
    await driver.openNotifications()

    // Step 6: Wait for OTP notification to appear
    let notificationXpath = await driver.$('//android.widget.TextView[@text="AX-NCISM"]')
    await notificationXpath.waitForDisplayed({timeout:15000, timeoutMsg: "After 15Secs Otp is not arrived"})
    
    // Step 7: Open Google Messages app to extract OTP
    await driver.startActivity(
      'com.google.android.apps.messaging', // app package
      '.ui.ConversationListActivity' // app activity
    )

    // Step 8: Click on the conversation with OTP
    await driver.$(`android=new UiSelector().text("AX-NCISM")`).click()

    // Step 9: Extract OTP message text
    const otpMessage = await driver.$('(//android.view.View[@resource-id="message_list"]//android.widget.TextView)[2]').getText()
    let otpValue = await otpMessage.split(" ")[5].replace('.','')

    // Step 11: Switch back to the original app
    await driver.activateApp('com.artcode.prakrutiparikshan')

    // Step 12: Input OTP into the relevant fields
    for (let i = 0; i < otpValue.length; i++) {
      let otpTxtFld = await driver.$(`//android.widget.EditText[@resource-id="otp_input_${i}"]`)
      await otpTxtFld.setValue(otpValue.charAt(i))
    }

    // Step 13: Click the "Verify" button to submit OTP
    await driver.$('accessibility id:Verify').click()
  } finally {
    await driver.pause(6000);
    await driver.deleteSession();
  }
}

runTest().catch(console.error);