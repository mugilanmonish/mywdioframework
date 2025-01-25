import reporter from "../../genricUtility/allureUtility.js";
import webdriverUtility from "../../genricUtility/webdriverUtility.js";
import { assert, expect } from "chai";

class SelectBus {

    get okBtnLocator() { return $("//span[text()='Ok, got it']") }
    get liveTrackingOpt() { return $("//ul[@class='addn-filters']/descendant::span[contains(text(),'Live Tracking')]") }
    get liveTrackingRemoveTxt() { return $("//li[@class='fl set-filters' and @title='Live Tracking']") }
    get liveTrackingRemoveIcon() { return $("//li[@class='fl set-filters' and @title='Live Tracking']/span") }
    get allBusList() { return $$('//ul[@class="bus-items"]/div') }
    singleBus(busNumber) { return $(`(//ul[@class="bus-items"]/div)[${busNumber}]`) }
    singleLiveTracking(busNumber) { return $(`(//ul[@class="bus-items"]/div//span[text()='Live Tracking'])[${busNumber}]`) }
    viewSeatsBtn(busNumber) { return `(//ul[@class='bus-items']//div[text()='View Seats'])[${busNumber}]` }
    get resetBtn() { return $("//span[text()='RESET']") }
    get totalBusesFound() { return $("//span[@class='f-bold busFound']") }

    async selectViewSeat(busNumber) {

    }

    async handlingOkgotItPopup() {
        await reporter.performStep('Handled Ok,got It popup', async () => {
            try {
                await webdriverUtility.waitForClickable(this.okBtnLocator)
                await this.okBtnLocator.click()
            } catch (error) {
                await reporter.stepLevelLog(`Ok,got it Button is Not Available`)
            }
        })
    }

    async clickingLiveTracking() {
        await reporter.performStep(`Clicking Live Tracking Option`, async () => {
            await this.liveTrackingOpt.click()
            await webdriverUtility.waitForClickable(this.liveTrackingRemoveTxt)
            const text = await this.liveTrackingRemoveTxt.getText()
            assert.strictEqual(text, "Live Tracking")
        })
    }

    async validateLiveTracking() {
        await reporter.performStep(`Live Tracking Option Clicked and Validated`, async () => {
            const liveTrackingOptColorBlack = await webdriverUtility.colorValidation(this.liveTrackingOpt, "color","#3e3e52")
            await reporter.stepLevelLog(`Validated Live Tracking Color Before Clicking ${liveTrackingOptColorBlack}`)
            await this.clickingLiveTracking()
            const liveTrackingOptColorRed = await webdriverUtility.colorValidation(this.liveTrackingOpt, "color","#da4e52")
            await reporter.stepLevelLog(`Validated Live Tracking Color After Clicking ${liveTrackingOptColorRed}`)
        })

        let number = 0
        await reporter.performStep(`Validated the Live Tracking Bus List in Count`, async () => {
            const busCountInLiveTracking = await this.liveTrackingOpt.getText()
            const match = busCountInLiveTracking.match(/\((\d+)\)/)
            number = parseInt(match[1], 10)
            await reporter.stepLevelLog(`Total Busses after in Live Tracking Option ${number}`)
        })

        await reporter.performStep(`Validated bus list and Live Tracking label in all Buses`, async () => {
            for (let i = 1; number; i++) {
                let list = await this.allBusList.length
                if (list === number) {
                    assert.strictEqual(number, list)
                    await reporter.stepLevelLog(`Found and validated ${number} buses in the list`)
                    break
                } else {
                    await this.singleBus(i).scrollIntoView()
                    assert.isTrue(await this.singleLiveTracking(i).isDisplayed())
                }
            }
        })
    }

    async validateResetBtnForLiveTracking() {
        await this.clickingLiveTracking()
        await reporter.performStep('Validating Reset Button Functionality for Live Tracking', async ()=> {
            await this.resetBtn.click()
            await webdriverUtility.waitUntilElementToBeInvisible(this.liveTrackingRemoveTxt)
            assert.strictEqual(false, await this.liveTrackingRemoveTxt.isDisplayed())
        })

        await reporter.performStep('Validating Live Tracking color after clicking Reset Button', async () => {
            await webdriverUtility.colorValidation(this.liveTrackingOpt, "color","#3e3e52")
        })

        await this.clickingLiveTracking()
        await reporter.performStep(`Validating Live Tracking Filter Remove Icon`, async() => {
            await this.liveTrackingRemoveIcon.click()
            await webdriverUtility.waitUntilElementToBeInvisible(this.liveTrackingRemoveTxt)
        })
        await reporter.performStep('Validating Live Tracking color after clicking Filter Remove Icon Button', async () => {
            await webdriverUtility.colorValidation(this.liveTrackingOpt, "color","#3e3e52")
        })
        await reporter.performStep('Validating Live Tracking Is Not Displayed in Atleast One Bus', async() =>{
            const busCountInLiveTracking = await this.liveTrackingOpt.getText()
            const match = busCountInLiveTracking.match(/\((\d+)\)/)
            let lTBusCount = parseInt(match[1], 10)
            const busCountInTotalBusFound = await this.totalBusesFound.getText()
            const totalBusFoundCount = busCountInTotalBusFound.match(/\d+/)[0]
            assert.notStrictEqual(lTBusCount, totalBusFoundCount)
            await reporter.stepLevelLog(`Validated Live Tracking bus ${lTBusCount} is not matching with Total Buses Found ${totalBusFoundCount}`)
        })  
    }
}
export default new SelectBus();