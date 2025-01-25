import javascriptUtility from "../../../genricUtility/javascriptUtility.js";
import homePage from "../../pageobjects/home.page.js";
import selectBusPage from "../../pageobjects/selectBus.page.js";
import data from "../../testData/allDataImport.js";


describe('Redbus E2E', async () => {
    let boarding = data.bookingData.boardingPoint
    let destination = data.bookingData.destination
    const todayDate = javascriptUtility.getDate()

    it('First Bus Booking', async () => {
        /* Searching Busses */
        await homePage.enterBoardingAndDestination(boarding, destination, todayDate)

        /* Handling Popup */
        await selectBusPage.handlingOkgotItPopup()

        /* validate Dst Src Date */
        await selectBusPage.validateDstSrcDate(boarding, destination, todayDate)

        /* Clicking 1st bus */
        await selectBusPage.selectViewSeat(1)

        /* Validate Bus Seat Canvas */
        await selectBusPage.validateBusSeats()
    })

    it('Second Bus Booking', async () => {
        /* Searching Busses */
        await homePage.enterBoardingAndDestination(boarding, destination, todayDate)

        /* Handling Popup */
        await selectBusPage.handlingOkgotItPopup()

        /* validate Dst Src Date */
        await selectBusPage.validateDstSrcDate(boarding, destination, todayDate)

        /* Clicking 1st bus */
        await selectBusPage.selectViewSeat(2)

        /* Validate Bus Seat Canvas */
        await selectBusPage.validateBusSeats()
    })
})