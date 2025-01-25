import javascriptUtility from "../../../genricUtility/javascriptUtility.js";
import reporter from "../../../genricUtility/allureUtility.js";
import searchBusPage from "../../pageobjects/searchBus.page.js";
import selectBusPage from "../../pageobjects/selectBus.page.js";
import data from "../../testData/allDataImport.js";

describe('Live Tracking Functionality', async () => {
    let boarding = data.bookingData.boardingPoint
    let destination = data.bookingData.destination
    const todayDate = javascriptUtility.getDate()
    it('Validating color, bus count, Live Tracking label in Buses', async () => {
        /* Searching Busses */
        await searchBusPage.enterBoardingAndDestination(boarding, destination, todayDate)

        /* Handling Popup */
        await selectBusPage.handlingOkgotItPopup()

        /* Validating live Tracking Functionality */
        await selectBusPage.validateLiveTracking()
    })

    it('Reset button, Live Traking label not present in atleast one Bus', async () => {
        /* Searching Busses */
        await searchBusPage.enterBoardingAndDestination(boarding, destination, todayDate)

        /* Handling Popup */
        await selectBusPage.handlingOkgotItPopup()

        /* Validating Reset Button after clicking */
        await selectBusPage.validateResetBtnForLiveTracking()
    })
})