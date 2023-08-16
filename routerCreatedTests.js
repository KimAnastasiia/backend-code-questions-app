const express = require('express');
const crypto = require('crypto');
const routerCreatedTests = express.Router();
const database = require("./database")

routerCreatedTests.get("/", async (req, res) => {
    database.connect();
    try {
        const results = await database.query("SELECT DISTINCT nameOfTest, email FROM createdtests WHERE email = ? ", [ req.googleUserData.email])
        database.disConnect()
        return res.send(results)
    } catch (error) {
        database.disConnect()
        return res.send({ error: error });
    }
})

routerCreatedTests.post("/", async (req, res) => {

    try {
        req.body.forEach(async (el) => {

            try {
                await database.connect()
                await database.query(
                    "INSERT INTO createdtests ( code, email, question, answer1, answer2, answer3, answer4, rightAnswer, nameOfTest ) VALUES  (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [el.code, req.googleUserData.email, el.question, el.answer1, el.answer2, el.answer3, el.answer4, el.rightAnswer, el.nameOfTest])
                await database.disConnect()
            } catch (er) {
                await database.disConnect()
            }


        })


        database.disConnect()
    } catch (error) {
        database.disConnect()
        return res.send({ error: error })
    }


})
module.exports = routerCreatedTests