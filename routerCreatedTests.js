const express = require('express');
const crypto = require('crypto');
const routerCreatedTests = express.Router();
const database = require("./database")

routerCreatedTests.post("/", async (req, res) => {

    try {
        req.body.forEach(async (el) => {

            try {
                await database.connect()
                await database.query(
                    "INSERT INTO createdtests ( code, email, question, answer1, answer2, answer3, answer4, rightAnswer, nameOfTest, testId ) VALUES  (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [el.code, req.googleUserData.email, el.question, el.answer1, el.answer2, el.answer3, el.answer4, el.rightAnswer, el.nameOfTest, req.query.testId])
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
routerCreatedTests.delete('/', async(req, res) => {
    
    let testId = req.query.testId
    database.connect();

    try{
        await database.query("DELETE FROM createdtests WHERE testId=?", [testId])
        database.disConnect();
        res.send({messege:"done"})

    } catch (error){
        return res.send({error: error});
    }
})
module.exports = routerCreatedTests