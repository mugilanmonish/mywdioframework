import { Key } from "webdriverio";
describe('Mobile Safari Browser Test on iOS', () => {
    it('should open a website and verify the title', async () => {
        // Open a URL in Safari
        if (process.env.BROWSER_NAME === 'safari') {
            // await browser.pause(5000)
            const contexts = await browser.getContexts(); // Explicitly type contexts as string[]
            console.log('Available contexts:', contexts);
            const webviewContext = contexts.find((context) => context.includes('WEBVIEW')); // Type as string or undefined
            if (!webviewContext) {
                throw new Error('WebView context not found!');
            }
            await browser.switchContext(webviewContext);
            console.log("Switched to context: " + webviewContext);
            const currentContext = await browser.getContext();
            console.log('Current Context:', currentContext);
        }
        // await browser.url('https://www.google.com');
       
        // await browser.pause(2000)
        
        // Wait for the page to load (you can add more waits if necessary)
        const title = await browser.getTitle();

        // Verify the page title
        console.log('Page Title:', title);
        expect(title).toContain('Google');  // Example assertion

        // Optionally, you can interact with elements
        const searchInput = await $("textarea[name='q']"); // Google search input
        await searchInput.setValue('WebDriverIO');
        await browser.keys([Key.Enter])
        await $("//a[@href='https://webdriver.io/']").click()
        // Wait for search results and validate some text
        await browser.waitUntil(async () => {
            const results = await $("//button[@aria-label='Search (Ctrl+K)']");
            return results.isDisplayed();
        }, {
            timeout: 10000,
            timeoutMsg: 'Search results not loaded',
        });

        const resultsTitle = await browser.getTitle();
        expect(resultsTitle).toContain('WebdriverIO');
    });
});
