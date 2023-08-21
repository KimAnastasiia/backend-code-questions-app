const express = require('express');
const crypto = require('crypto');
const routerQuestionsPrivate = express.Router();
const database = require("./database")

routerQuestionsPrivate.get("/:id", async (req, res) => {

    let id = req.params.id
    database.connect();
    try {
        const results = await database.query(`SELECT questions.*, tests.name AS nameOfTest 
        FROM questions 
        JOIN tests
        ON questions.testId=tests.id 
        WHERE testId = ?`, [id])
        database.disConnect()
        return res.send(results)
    } catch (error) {
        database.disConnect()
        return res.send({ error: error });
    }
})
routerQuestionsPrivate.post("/", async (req, res) => {

    try {
        await database.connect()
        req.body.forEach(async (el, index) => {

            try {

                await database.query(
                    "INSERT INTO questions ( numberOfQuestion, code, email, question, answer1, answer2, answer3, answer4, rightAnswer, testId ) VALUES  (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [(index + 1), el.code, req.googleUserData.email, el.question, el.answer1, el.answer2, el.answer3, el.answer4, el.rightAnswer, req.query.testId])

            } catch (er) {
                await database.disConnect()
            }


        })


        database.disConnect()
        res.send({ messege: "done" })
    } catch (error) {
        database.disConnect()
        return res.send({ error: error })
    }


})

routerQuestionsPrivate.put("/", async (req, res) => {
    let listOfQuestions = req.body
    await database.connect()
    listOfQuestions.forEach(async (test) => {
        try {

            await database.query("UPDATE questions SET  question=?, answer1=?,  answer2=?, answer3=?, answer4=?, rightAnswer=?, code=?  where testId=? and numberOfQuestion=? and email=? ",
                [test.question, test.answer1, test.answer2, test.answer3, test.answer4, test.rightAnswer, test.code, test.testId, test.numberOfQuestion, req.googleUserData.email])

        } catch (error) {
            database.disConnect()
            return res.send({ error: error })
        }
    })
    database.disConnect()
    return res.send({ message: "done" });

})

routerQuestionsPrivate.delete('/', async (req, res) => {

    let testId = req.query.testId
    database.connect();

    try {
        await database.query("DELETE FROM questions WHERE testId=?", [testId])
        database.disConnect();
        res.send({ messege: "done" })

    } catch (error) {
        return res.send({ error: error });
    }
})
routerQuestionsPrivate.delete('/:numberOfQuestion', async (req, res) => {
    let numberOfQuestion = req.params.numberOfQuestion
    let testId = req.query.testId
    database.connect();

    try {
        await database.query("DELETE FROM questions WHERE testId=? and numberOfQuestion=?", [testId, numberOfQuestion])
        database.disConnect();
        res.send({ messege: "done" })

    } catch (error) {
        return res.send({ error: error });
    }
})
routerQuestionsPrivate.post("/addByOne", async (req, res) => {

    try {
        await database.connect()

        if (req.body != undefined) {
            try {

                await database.query(
                    "INSERT INTO questions ( numberOfQuestion, code, email, question, answer1, answer2, answer3, answer4, rightAnswer, testId ) VALUES  (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [req.body.numberOfQuestion, req.body.code, req.googleUserData.email, req.body.question, req.body.answer1, req.body.answer2, req.body.answer3, req.body.answer4, req.body.rightAnswer, req.query.testId])
                database.disConnect()
                res.send({ messege: "done" })
            } catch (er) {
                await database.disConnect()
            }
        }

    } catch (error) {
        database.disConnect()
        return res.send({ error: error })
    }


})
module.exports = routerQuestionsPrivate