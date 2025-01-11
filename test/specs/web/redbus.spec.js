import javascriptUtility from "../../../genricUtility/javascriptUtility.js";
import data from "../../testData/allDataImport.js";
import reporter from "../../../genricUtility/allureUtility.js";
import webdriverUtility from "../../../genricUtility/webdriverUtility.js";
import { expect } from "chai";

describe('Redbus E2E', async () => {

    it('First Bus Booking', async () => {
        let boarding = data.bookingData.boardingPoint
        await $("input[id='src']").addValue(boarding)
        await reporter.stepLevelLog(`Entered ${boarding} in From Text Field`)
        await $(`//text[@class='placeholderSubText']/preceding-sibling::text[text()='${boarding}']`).click()
        await reporter.stepLevelLog(`Clicked ${boarding} in the suggestion`)

        let destination = data.bookingData.destination
        await $("input[id='dest']").addValue(destination)
        await reporter.stepLevelLog(`Entered ${destination} in To Text Field`)
        await $(`//text[@class='placeholderSubText']/preceding-sibling::text[text()='${destination}']`).click()
        await reporter.stepLevelLog(`Clicked ${destination} in the suggestion`)

        const todayDate = javascriptUtility.getDate()
        const date = await $(`(//span[text()='${todayDate}'])[1]`)
        await date.scrollIntoView({ block: 'center', inline: 'center' })
        await webdriverUtility.waitForClickable(`(//span[text()='${todayDate}'])[1]`)
        await date.click()
        await reporter.stepLevelLog(`Clicked Today's Date ${todayDate} in the Calendar`)

        const searchBtn = await $("button[id='search_button']")
        await searchBtn.scrollIntoView({ block: 'center', inline: 'center' })
        await searchBtn.click()
        await reporter.stepLevelLog(`Clicked Search Buses Button`)

        const okBtnLocator = "//span[text()='Ok, got it']"
        try {
            await webdriverUtility.waitForClickable(okBtnLocator)
            await $(okBtnLocator).click()
            await reporter.stepLevelLog(`Clicked Ok,got it Button`)
        } catch (error) {
            await reporter.stepLevelLog(`Ok,got it Button is Not Available`)
        }


        const source = await $("//span[@class='src']").getAttribute('title')
        expect(source).contains(boarding)
        await reporter.stepLevelLog(`Validated "${source}" Boarding Location in Search Bus Page`)

        const dst = await $("//span[@class='dst']").getAttribute('title')
        expect(dst).contains(destination)
        await reporter.stepLevelLog(`Validated "${dst}" Destination Location in Search Bus Page`)

        const searchDate = await $("input[id='searchDat']").getAttribute('value')
        expect(searchDate).contains(todayDate)
        await reporter.stepLevelLog(`Validated "${searchDate}" Date in Search Bus Page`)

        await $("(//ul[@class='bus-items']//div[text()='View Seats'])[1]").click()
        await reporter.stepLevelLog(`Clicked First Bus View Seats Button`)

        await webdriverUtility.waitForClickable(`//div[text()='HIDE SEATS']`)
        await browser.pause(2000)
        const busSeats = await $("//canvas[@data-type='lower']").isDisplayed()
        expect(busSeats, 'Bus Seats is not displayed').to.be.true
        await reporter.stepLevelLog(`Validated the visibility of Bus Seats`)
        console.log(`FIRST BUS`);

    })

    it.skip('Second Bus Booking', async () => {
        let boarding = data.bookingData.boardingPoint
        await $("input[id='src']").addValue(boarding)
        await reporter.stepLevelLog(`Entered ${boarding} in From Text Field`)
        await $(`//text[@class='placeholderSubText']/preceding-sibling::text[text()='${boarding}']`).click()
        await reporter.stepLevelLog(`Clicked ${boarding} in the suggestion`)

        let destination = data.bookingData.destination
        await $("input[id='dest']").addValue(destination)
        await reporter.stepLevelLog(`Entered ${destination} in To Text Field`)
        await $(`//text[@class='placeholderSubText']/preceding-sibling::text[text()='${destination}']`).click()
        await reporter.stepLevelLog(`Clicked ${destination} in the suggestion`)

        const todayDate = javascriptUtility.getDate()
        const date = await $(`(//span[text()='${todayDate}'])[1]`)
        await date.scrollIntoView({ block: 'center', inline: 'center' })
        await webdriverUtility.waitForClickable(`(//span[text()='${todayDate}'])[1]`)
        await date.click()
        await reporter.stepLevelLog(`Clicked Today's Date ${todayDate} in the Calendar`)

        const searchBtn = await $("button[id='search_button']")
        await searchBtn.scrollIntoView({ block: 'center', inline: 'center' })
        await searchBtn.click()
        await reporter.stepLevelLog(`Clicked Search Buses Button`)

        const okBtnLocator = "//span[text()='Ok, got it']"
        await webdriverUtility.waitForClickable(okBtnLocator)
        await $(okBtnLocator).click()
        await reporter.stepLevelLog(`Clicked Ok,got it Button`)

        const source = await $("//span[@class='src']").getAttribute('title')
        expect(source).contains(boarding)
        await reporter.stepLevelLog(`Validated "${source}" Boarding Location in Search Bus Page`)

        const dst = await $("//span[@class='dst']").getAttribute('title')
        expect(dst).contains(destination)
        await reporter.stepLevelLog(`Validated "${dst}" Destination Location in Search Bus Page`)

        const searchDate = await $("input[id='searchDat']").getAttribute('value')
        expect(searchDate).contains(todayDate)
        await reporter.stepLevelLog(`Validated "${searchDate}" Date in Search Bus Page`)

        await $("(//ul[@class='bus-items']//div[text()='View Seats'])[2]").click()
        await reporter.stepLevelLog(`Clicked Second Bus View Seats Button`)

        await webdriverUtility.waitForClickable(`//div[text()='HIDE SEATS']`)
        const busSeats = await $("//canvas[@data-type='lower']").isDisplayed()
        expect(busSeats, 'Bus Seats is not displayed').to.be.true
        await reporter.stepLevelLog(`Validated the visibility of Bus Seats`)
        console.log(`SECOND BUS`);
    })
})