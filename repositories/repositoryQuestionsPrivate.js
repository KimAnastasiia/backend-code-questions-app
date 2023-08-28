const database = require("../database")

repositoryQuestionsPrivate = {
    getQuestion: async (id) => {
        let results = null

        try {
            database.connect();
            results = await database.query(`SELECT questions.*, tests.name AS nameOfTest 
            FROM questions 
            JOIN tests
            ON questions.testId=tests.id 
            WHERE testId = ?`, [id])
            database.disConnect()
        } catch (error) {
            database.disConnect()
            console.log(error)
        }
        return results
    },
    insertQuestionByOne: async (numberOfQuestion, code, email, question, answer1, answer2, answer3, answer4, rightAnswer, testId) => {
        let result = null
        try {
            database.connect()
            try {
                result = await database.query(
                    "INSERT INTO questions ( numberOfQuestion, code, email, question, answer1, answer2, answer3, answer4, rightAnswer, testId ) VALUES  (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [numberOfQuestion, code, email, question, answer1, answer2, answer3, answer4, rightAnswer, testId])
                database.disConnect()
            } catch (er) {
                database.disConnect()
                console.log(er)
            }

        } catch (error) {
            database.disConnect()
            console.log(error)
        }
        return result
    },
    insertQuestions: async (index ,code, email,question,answer1,answer2, answer3, answer4, rightAnswer, testId) => {
        let result=null
        try {
            await database.connect()
            result = await database.query(
            "INSERT INTO questions ( numberOfQuestion, code, email, question, answer1, answer2, answer3, answer4, rightAnswer, testId ) VALUES  (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [index,code, email, question,answer1, answer2, answer3, answer4, rightAnswer, testId])
            result=true
            database.disConnect()
        } catch (error) {
            database.disConnect()
            console.log(error)
        }
        return result 
    },
    updateQuestions: async (question, answer1, answer2, answer3,answer4, rightAnswer, code, testId, numberOfQuestion, email) => {
        let result = null
        try {
            await database.connect()
            await database.query("UPDATE questions SET  question=?, answer1=?,  answer2=?, answer3=?, answer4=?, rightAnswer=?, code=?  where testId=? and numberOfQuestion=? and email=? ",
            [question, answer1, answer2, answer3,answer4,rightAnswer,code,testId, numberOfQuestion, email])
            result=true
            database.disConnect()
        } catch (err) {
            database.disConnect()
            console.log(err)
        }
        return result
    },
    deleteAllQuestionsOfTest: async (testId) => {

       
        let result = null
        try {
            database.connect();
            result= await database.query("DELETE FROM questions WHERE testId=?", [testId])
            database.disConnect();
        } catch (error) {
            database.disConnect();
        }
        return result
    },
    deleteQuestionInTest: async (numberOfQuestion, testId) => {

        let result = null
        try {
            database.connect();
            result= await database.query("DELETE FROM questions WHERE testId=? and numberOfQuestion=?", [testId, numberOfQuestion])
            database.disConnect();


        } catch (error) {
            database.disConnect();
        }
        return result
    }
}
module.exports = repositoryQuestionsPrivate