import axios from "axios";
import report from "../genricUtility/allureUtility.js";
import { BS_USERNAME, BS_ACCESS_KEY } from "../config.js";

class ApiUtility {

    async getBrowserstackPublicLink() {
        const sessionId = await browser.sessionId
        const url = `https://api.browserstack.com/automate/sessions/${sessionId}.json`;
        try {
            const response = await axios.get(url, {
                auth: {
                    username: BS_USERNAME,
                    password: BS_ACCESS_KEY
                }
            });
            const publicUrl = await response.data.automation_session.public_url;
            const linkHtml = `
            <div style="background-color: #f0f0f0; padding: 10px; border-radius: 5px; font-family: Arial, sans-serif;">
                <h3 style="color: #333;">Click &#x1F447; to view BrowserStack Execution Video:</h3>
                <a href="${publicUrl}" target="_blank" style="color: #007bff; font-size: 16px; text-decoration: none; font-weight: bold;">
                   View BrowserStack Execution Video
                </a>
            </div>`;

            await report.addAttachment('BrowserStack Public Link', linkHtml, 'text/html');
            return publicUrl
        } catch (error) {
            console.error('Error fetching the public URL:', error);
        }
    }
}

export default new ApiUtility()