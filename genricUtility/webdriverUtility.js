import { assert } from "chai"

class WebdriverUtility {

    async waitForTitle(currentTitle) {
        await browser.waitUntil(async () => {
            const title = await browser.getTitle()
            return await (title.includes(currentTitle))
        }, {
            timeout: "15000",
            interval: "500",
            timeoutMsg: `${currentTitle} is Not available`
        })
    }

    async switchToFrame(locator) {
        await browser.waitUntil(async () => {
            return await $(locator).isDisplayed()
        }, {
            timeout: 10000,
            interval: 500,
            timeoutMsg: "FRAME IS NOT DISPLAYED"
        })
        await browser.switchFrame(locator)
    }

    async switchToWindow() {
        await browser.waitUntil(async () => {
            return (await (await browser.getWindowHandles()).length === 2)
        }, {
            timeout: 10000,
            interval: 500,
            timeoutMsg: "WINDOW IS NOT LOADED IN 10 SEC"
        })
        const handles = await browser.getWindowHandles()
        await browser.switchToWindow(handles[1])
    }

    async waitForClickable(element, waitTime = 15000) {
        await browser.waitUntil(async () => { return await element.isClickable() },
            { timeout: waitTime, timeoutMsg: `ELEMENT IS NOT CLICKABLE AFTER IN ${waitTime / 1000} SEC` })
    }

    async waitUntilElementToBeInvisible(element, waitTime = 15000) {
        await browser.waitUntil(async () => {
            return (await element.isDisplayed() === false)
        }, {
            timeout: waitTime, timeoutMsg: `Element is Displaying after ${waitTime / 1000} SEC`
        })
    }

    async clickByJs(locator) {
        const element = await browser.$(locator)
        await browser.execute((ele) => {
            ele.click()
        }, element)
    }

    /**
     * 
     * @param {WebdriverIO.Element} element This is element object
     * @param {String} cssProperty This is css property (e.g "color", "background-color")
     * @param {String} expectedColor This is expected color in hexa decimal (e.g #da4e52, #000000)
     */
    async colorValidation(element, cssProperty, expectedColor) {
        const rgbValue = await element.getCSSProperty(cssProperty)
        const actualColor = await rgbValue.parsed.hex.toString()
        assert.strictEqual(actualColor, expectedColor, "Color is Not Matching")
        return actualColor
    }
}

export default new WebdriverUtility()