import axios from "axios";
import fs from 'fs';
import FormData from 'form-data';
import report from "../genricUtility/allureUtility.js";
import { BS_USERNAME, BS_ACCESS_KEY } from "../config.js";

class ApiUtility {

    async getBrowserstackPublicLink(executionType) {
        const sessionId = await browser.sessionId
        const url = `https://api.browserstack.com/${executionType}/sessions/${sessionId}.json`;
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

    /**
     * @description This function is used to upload the apk file in browserstack.
     * @param {String} apkPath Based on the application name, We need to pass absolute path of the apk file
     * @returns It will return the app url (e.g bs://8ac6119a2a87547e919022b993e12b4fcd50494f)
     */
    async uploadApk(apkPath) {
        const apkFile = fs.createReadStream(apkPath);
        const formData = new FormData();
        formData.append('file', apkFile);
    
        try {
            const response = await axios.post('https://api.browserstack.com/app-automate/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                auth: {
                    username: BS_USERNAME,
                    password: BS_ACCESS_KEY
                },
            });
    
            return response.data.app_url; // This will give the URL of the uploaded APK
        } catch (error) {
            console.error('Error uploading APK:', error.message);
            throw new Error('Failed to upload APK to BrowserStack');
        }
    }
}

export default new ApiUtility()