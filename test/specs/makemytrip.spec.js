describe('Make my trip', async () => {
    it('Click loweset price date', async () => {
        await browser.url('https://www.makemytrip.com/')
        const closeModal = await $("//span[@data-cy='closeModal']")
        closeModal.waitForClickable({ timeout: 10000 })
        closeModal.click()
        const depatureLabel = await $('//label[@for="departure"]')
        await browser.waitUntil(async () => {
            return depatureLabel.isClickable()
        })
        depatureLabel.click()
        await $("//div[text()='January 2025']").waitForClickable({ timeout: 20000 })
        const allPrice = await $$('//div[text()="January 2025"]/ancestor::div[@class="DayPicker-Month"]/descendant::p[@class=" todayPrice"]')
        const prices = []  
        for (const element of allPrice) {
            const ele = await (await element.getText()).replace(',', '')
            prices.push(ele)
        }
        console.log(await prices);
        let lowerPrice = Number(prices[0]);
        for (let i = 1; i < prices.length; i++) {
            let currentPrice = Number(prices[i]); 
            if (lowerPrice > prices[i]) {
                lowerPrice = currentPrice
            }
        }
        lowerPrice = lowerPrice.toLocaleString()
        console.log(`Lower Price ${lowerPrice} --> ${typeof lowerPrice}`);
        const lowerPriceDate = await $(`//div[text()='January 2025']/ancestor::div[@class='DayPicker-Month']//p[text()='${lowerPrice}']`)
        await lowerPriceDate.click()
    })
})