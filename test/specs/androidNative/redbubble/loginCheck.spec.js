describe('Redbubble', async()=>{
    it('Login', async() =>{
        await $(`android=new UiSelector().className("android.widget.Button").instance(0)`).click();
        await $(`android=new UiSelector().text("Email Address or Username")`).setValue('mugilanmonish@gmail.com');
        await $(`android=new UiSelector().text("Password")`).setValue('India@123');
        await $(`android=new UiSelector().resourceId("com.redbubble:id/authenticateButton")`).click();
    })
})