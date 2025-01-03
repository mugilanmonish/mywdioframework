describe.skip('Otp Scenario', async()=>{
    it('should enter otp in flipkart', async()=>{
        await browser.pause(5000)
        await browser.startActivity('com.google.android.apps.messaging', 'com.google.android.apps.messaging.ui.ConversationListActivity');
    })
})