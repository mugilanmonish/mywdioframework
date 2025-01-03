import allure from "../../genricUtility/allureUtility";
// const allure = require("../../genricUtility/allureUtility");

// const testData = require('../testData/data'); // CommonJS import
import data from '../testData/allDataImport'; // Adjust the path accordingly
describe.skip("Launch", async () => {
    it.only("Test Drive", async () =>{
        await allure.addFeatureName("Home Page Validation")
        await allure.addTestCaseId("TC_10")
        const title = await $("//div[@class='topSection']/h1").getText()
        await allure.stepLevelLog(`Getting title ${title}`)
        expect(title).toEqual("India's No. 1 Online Bus Ticket Booking Site")
        await allure.stepLevelLog(`Validating the title`)
        console.log(`Handles ${await browser.getWindowHandles()}`);
        console.log("**********ENV "+ data.loginData.username);
        console.log("**********COMMON "+ data.common.login.commonPassword);
        console.log("**********ENV "+ data.bookingData.boardingPoint);
        await browser.pause(10000)
    })

    it.skip("Test Drive1", async () =>{
        await allure.addFeatureName("Home Page Validation2")
        const title = await $("//div[@class='topSection']/h1").getText()
        await allure.stepLevelLog(`Getting title ${title}`)
        expect(title).toEqual("India's No. 1 Online Bus Ticket Booking Site")
        await allure.stepLevelLog(`Validating the title`)
    })

    it.skip("Test Drive2", async () =>{
        await allure.addFeatureName("Home Page Validation")
        const title = await $("//div[@class='topSection']/h1").getText()
        await allure.stepLevelLog(`Getting title ${title}`)
        expect(title).toEqual("India's No. 1 Online Bus Ticket Booking Site")
        await allure.stepLevelLog(`Validating the title in Third it block`)
        console.log(`Handles ${await browser.getWindowHandles()}`);
        console.log("**********ENV "+ data.loginData.username);
        console.log("**********COMMON "+ data.common.login.commonPassword);
        console.log("**********ENV "+ data.bookingData.boardingPoint);
        
    })
})