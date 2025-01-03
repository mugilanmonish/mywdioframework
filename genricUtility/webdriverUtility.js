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

    async waitForClickable(locator) {
        await browser.waitUntil(async () => { return await $(locator).isDisplayed() },
            { timeout: 15000, timeoutMsg: 'ELEMENT IS NOT CLICKABLE AFTER IN 15 SEC' })
    }

    async clickByJs(locator) {
        const element = await browser.$(locator)
        await browser.execute((ele) => {
            ele.click()
        }, element)
    }
}

export default new WebdriverUtility()