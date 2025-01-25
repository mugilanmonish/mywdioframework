import javascriptUtility from "../../genricUtility/javascriptUtility.js";
import webdriverUtility from "../../genricUtility/webdriverUtility.js";
import reporter from "../../genricUtility/allureUtility.js";
import { assert, expect } from "chai";

class HomePage {

    get boardingTxtFld() { return $("input[id='src']") }
    get destinationTxtFld() { return $("input[id='dest']") }
    boardingSuggestion(boarding) { return $(`//text[@class='placeholderSubText']/preceding-sibling::text[text()='${boarding}']`) }
    destinationSuggestion(destination) { return $(`//text[@class='placeholderSubText']/preceding-sibling::text[text()='${destination}']`) }
    date(desiredDate) { return $(`(//span[text()='${desiredDate}'])[1]`) }
    get searchBtn() { return $("button[id='search_button']") }

    /**
     * @description This function is used for search bus
     * @param {String} boarding This is From location
     * @param {String} destination This is To location
     * @param {Number} desiredDate This is the date for the journey travelling
     */
    async enterBoardingAndDestination(boarding, destination, desiredDate) {
        // Entering boarding
        await reporter.performStep(`Entered ${boarding} in From Text Field`, async () => {
            await this.boardingTxtFld.addValue(boarding);
        });
        await reporter.performStep(`Clicked ${boarding} in the suggestion`, async () => {
            await webdriverUtility.waitForClickable(this.boardingSuggestion(boarding))
            await this.boardingSuggestion(boarding).click()
        });
        // Entering destination
        await reporter.performStep(`Entered ${destination} in To Text Field`, async () => {
            await this.destinationTxtFld.addValue(destination)
        });
        await reporter.performStep(`Clicked ${destination} in the suggestion`, async () => {
            await webdriverUtility.waitForClickable(this.destinationSuggestion(destination))
            await this.destinationSuggestion(destination).click()
        })
        await reporter.performStep(`Clicked Today's Date ${desiredDate} in the Calendar`, async () => {
            await this.date(desiredDate).scrollIntoView({ block: 'center', inline: 'center' })
            await webdriverUtility.waitForClickable(this.date(desiredDate))
            await this.date(desiredDate).click()
        })
        await reporter.performStep(`Clicked Search Buses Button`, async () => {
            await this.searchBtn.scrollIntoView({ block: 'center', inline: 'center' })
            await this.searchBtn.click()
        })
    }
}
export default new HomePage();