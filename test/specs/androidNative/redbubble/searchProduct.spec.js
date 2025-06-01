import { assert } from "chai";
describe('Redbubble', async () => {
    it('Search Product', async () => {
        try {
            await driver.$(`android=new UiSelector().text("Continue as a guest")`).click();
        } catch (error) {
            console.error('Continue as guest is not displayed')
        }
        const searchBtn = await driver.$(`android=new UiSelector().resourceId("com.redbubble:id/navigation_bar_item_icon_view").instance(1)`);
        await searchBtn.click();
        const searchBar = await driver.$(`android=new UiSelector().text("Find your thing")`);
        await searchBar.click();
        await searchBar.setValue('dogs');
        await driver.$(`android=new UiSelector().text("dogs").instance(0)`).click();
        await driver.$(`android=new UiSelector().text("Fetch Happens – Just Deal With It (Border Collie Attitude)")`).click();
        await driver.$(`android=new UiSelector().resourceId("com.redbubble:id/addtocart")`).click();
        const cartValue = await driver.$(`android=new UiSelector().resourceId("com.redbubble:id/action_menu_cart")`).getAttribute('content-desc')
        assert.equal('Cart, 1 new notification', cartValue)
    })
})