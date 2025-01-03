import allureReporter from "@wdio/allure-reporter";

class AllureReport {

    /**
     * @description This function is used to add step level log statment.
     * @param {String} Message
     * @author Mugilan
     */
    async stepLevelLog(statment) {
        await allureReporter.addStep(statment)
    }
    
    /**
     * @description This function is used to add testcase id 
     * @param {String} Test Case Id as Per TCM
     * @author Mugilan
     */
    async addTestCaseId(testCaseID) {
        await allureReporter.addTestId(testCaseID)
    }

    /**
     * @description This function is used to add feature name
     * @param {String} Feature Name of the test case
     * @author Mugilan
     */
    async addFeatureName(featureName) {
        await allureReporter.addFeature(featureName)
    }

    /**
     * @description This is used to add attachment in the report
    */
    async addAttachment(visibleText, content , type) {
        await allureReporter.addAttachment(visibleText, content , type)
    }

    /**
     * @description This is used to add link in the report
     * @param {string} link 
     * @param {string} websiteName 
     */
    async addLink(link, websiteName) {
        await allureReporter.addLink(link, websiteName, 'website')
    }

}

export default new AllureReport()