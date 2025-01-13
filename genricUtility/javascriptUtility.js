class JavascriptUtility {

    getDate() {
        const date = new Date()
        return date.getDate()
    }

    getTime() {
        const now = new Date()
        return `${now.getDate()}-${(now.getMonth() + 1)}-${now.getFullYear()}_${now.getHours()}-${now.getMinutes()}`
    }
}

export default new JavascriptUtility();