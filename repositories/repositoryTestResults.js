const database = require("../database")

repositoryTestResults = {

    getResults: async (testId) => {
        let results = null

        try {
            database.connect();
            results = await database.query("SELECT * from testresults WHERE testId=?", [testId])
            database.disConnect()
        } catch (error) {
            database.disConnect()
            console.log(error)
        }
        return results
    },
    deleteResults: async (testId) => {

        let result = null
        try {
            database.connect();
            result = await database.query("DELETE FROM testresults WHERE testId=?", [testId])
            database.disConnect();
        } catch (error) {
            database.disConnect();
        }
        return result
    }
}
module.exports = repositoryTestResults