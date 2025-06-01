describe('Test Script', async () => {
    it('Otp Scenario', async () => {
        await browser.url('https://ecozaar.in/')
        await $("//a[@id='haslogin']").click()
        await $('//input[@name="user_input"]').addValue('7349043393')
        await $("//button[text()='Get the OTP']").click()
        const otpVerificationTxt = $("(//h2[@id='otpHeading'])[1]")
        await browser.waitUntil(async () => {
            return await otpVerificationTxt.isClickable() === true
        }, {
            timeout: 15000,
            interval: 500,
            timeoutMsg: 'Otp Verifcation not displayed in 15Sec'
        })
        const otp = '9009'
        // instead of this function use getter
        function otpFields(index) {
            return $(`(//input[@class="user-otp-input-mobile"])[${index+1}]`)
        }
        // logic for entering otp
        for (let i = 0; i < otp.length; i++) {
            let otpTxtFld = otpFields(i)
            await otpTxtFld.setValue(otp.charAt(i))
        }
        const verifiedBtn = await $("(//button[contains(text(),'Get Verified')])[1]").click()
        await browser.pause(10000)
    })
})