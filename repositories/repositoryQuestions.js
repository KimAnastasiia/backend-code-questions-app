const database = require("../database")

repositoryQuestions = {
    getQuestions: async (id) => {
        let results = null

        try {
            database.connect();
            results = await database.query("SELECT email, question, answer1, answer2, answer3, answer4, code  FROM questions WHERE testId = ?", [id])
            database.disConnect()
        } catch (error) {
            database.disConnect()
            console.log(error)
        }
        return results
    },
    getAnswersOfQuestions: async (id) => {
        let results = null

        try {
            database.connect();
            results = await database.query("SELECT * FROM questions WHERE testId= ?", [id])
            database.disConnect()
        } catch (error) {
            database.disConnect()
            console.log(error)
        }
        return results
    },
    insertTestResult: async (listOfMarks, id, result, currentDate, answersInTexts, email) => {
        let results = null

        try {
            database.connect();
            results = await database.query("INSERT INTO testresults (testId, result, date, answers, email ) VALUES  (?, ?, ?, ?, ?)", [id, result, currentDate, answersInTexts.join(","), email])
            database.disConnect()
        } catch (error) {
            database.disConnect()
            console.log(error)
        }
        if(results==null)
            return results
        else
            return {
                listOfMarks: listOfMarks,
                mark: result
            }

    },

}
module.exports = repositoryQuestions