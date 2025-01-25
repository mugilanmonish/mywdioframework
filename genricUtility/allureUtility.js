import allureReporter from "@wdio/allure-reporter";

class AllureReport {

    /**
     * @description This function is used to add step level log statment.
     * @param {String} Message
     */
    async stepLevelLog(statment) {
        await allureReporter.addStep(statment)
    }

    /**
     * @description This function is used to add testcase id 
     * @param {String} Test Case Id as Per TCM
     */
    async addTestCaseId(testCaseID) {
        await allureReporter.addTestId(testCaseID)
    }

    /**
     * @description This function is used to add feature name
     * @param {String} Feature Name of the test case
     */
    async addFeatureName(featureName) {
        await allureReporter.addFeature(featureName)
    }

    /**
     * @description This is used to add attachment in the report
     */
    async addAttachment(visibleText, content, type) {
        await allureReporter.addAttachment(visibleText, content, type)
    }

    /**
     * @description This is used to add link in the report
     * @param {string} link 
     * @param {string} websiteName 
     */
    async addLink(link, websiteName) {
        await allureReporter.addLink(link, websiteName, 'website')
    }

    /**
     * @description This function is used to calculate the time of the action perform.
     * @param {String} stepDescription The step name will displayed in the allure report
     * @param {Function} action This is the action or actions to perform
     */
    async performStep(stepDescription, action) {
        await allureReporter.startStep(stepDescription);
        await action();
        await allureReporter.endStep();
    }
}

export default new AllureReport()