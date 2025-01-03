import webdriverUtility from "../../../genricUtility/webdriverUtility.js";
import report from "../../../genricUtility/allureUtility.js";

describe('Mobile Web Script', async () => {

    it('Redbus first bus booking', async () => {
        try {
            await browser.pause(2000)
            if (await $("//div[text()='Continue in English']").isClickable()) {
                await $("//div[text()='Continue in English']").click()
                await report.stepLevelLog(`Clicked Continue in English Button`)
            }
            await $("div[data-placeholder='FROM']").click()
        } catch (error) {
            await browser.pause(1000)
            await $("div[data-placeholder='FROM']").click()
        }
        await report.stepLevelLog(`Clicked From Input Field`)
        let boardingLocation = 'Madiwala'
        await $('#suggestInput').addValue(boardingLocation)
        await report.stepLevelLog(`Enter ${boardingLocation} in boarding Text Field`)
        await webdriverUtility.waitForClickable(`//span[text()='${boardingLocation}']`)
        await $(`//span[text()='${boardingLocation}']`).click()
        await report.stepLevelLog(`Clicked ${boardingLocation} in Suggestion`)
        await $("div[data-placeholder='TO']").click()
        await report.stepLevelLog(`Clicked TO Input Field`)
        let destinationLocation = 'Salem New Bus Stand'
        await $('#suggestInput').addValue(destinationLocation)
        await report.stepLevelLog(`Enter ${destinationLocation} in boarding Text Field`)
        await webdriverUtility.waitForClickable(`//*[text()='${destinationLocation}']`)
        await $(`//*[text()='${destinationLocation}']`).click()
        await report.stepLevelLog(`Clicked ${destinationLocation} in Suggestion`)
        try {
            await browser.pause(2000)
            if (await $("//div[text()='Continue in English']").isClickable()) {
                await $("//div[text()='Continue in English']").click()
                await report.stepLevelLog(`Clicked Continue in English Button`)
            }
        } catch (error) { 
            console.log(error);
        }
        const toTxtFldLoc = await $("div[data-placeholder='TO']").getLocation()
        const xx = Math.round(toTxtFldLoc.x)
        const yy = Math.round(toTxtFldLoc.y)
        await report.stepLevelLog(`TO Button Location ${xx} and ${yy}`)
        let tomorrowBtn = "//div[@class='SearchWidgetV3__StyledWidget-sc-6o6i8v-0 cTxitG search-widget-main-wrapper-new ']//button[text()='Tomorrow']"
        const element = await $(tomorrowBtn); // Find the element using the locator
        // Get element's position and size
        await browser.pause(3000)
        const location = await element.getLocation(); // Get element's position (x, y)
        const size = await element.getSize(); // Get element's size (width, height)
        const centerX = location.x + size.width / 2;
        const centerY = location.y + size.height / 2;
        // Calculate the center X and Y of the element
        const x = Math.round(centerX);
        const y = Math.round(centerY);
        await report.stepLevelLog(`Tomorrow Button Location ${x} and ${y}`)
        await driver.performActions([{
            type: 'pointer',
            id: 'finger1',
            parameters: { pointerType: 'touch' },
            actions: [
                { type: 'pointerMove', duration: 0, x: x, y: y }, // Move to the specified coordinates
                { type: 'pointerDown', button: 0 }, // Press down (touch start)
                { type: 'pause', duration: 100  }, // Optional pause to simulate human-like tap
                { type: 'pointerUp', button: 0 } // Release (touch end)
            ]
        }]);
        await browser.pause(3000)
        await report.stepLevelLog(`Clicked Tomorrow Button`)
        await $("(//li[@data-autoid='busitem'])[1]").click()
        await report.stepLevelLog(`Clicked First Bus in the list`)
        await webdriverUtility.waitForClickable("//div[@data-autoid='signin-close']")
        await $("//div[@data-autoid='signin-close']").click()
        await report.stepLevelLog(`Clicked Login Close Button`)
    })
})