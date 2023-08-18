const express = require('express');
const crypto = require('crypto');
const routerCreatedTests = express.Router();
const database = require("./database")

routerCreatedTests.get("/:id", async(req,res)=>{

    let id = req.params.id
    database.connect();
    try {
        const results = await database.query("SELECT *  FROM createdtests WHERE testId = ?", [id])
        database.disConnect()
        return res.send(results)
    } catch (error) {
        database.disConnect()
        return res.send({ error: error });
    }
})
routerCreatedTests.post("/", async (req, res) => {

    try {
        req.body.forEach(async (el, index) => {

            try {
                await database.connect()
                await database.query(
                    "INSERT INTO createdtests ( numberOfQuestion, code, email, question, answer1, answer2, answer3, answer4, rightAnswer, nameOfTest, testId ) VALUES  (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [(index+1), el.code, req.googleUserData.email, el.question, el.answer1, el.answer2, el.answer3, el.answer4, el.rightAnswer, el.nameOfTest, req.query.testId])
                await database.disConnect()
            } catch (er) {
                await database.disConnect()
            }


        })


        database.disConnect()
        res.send({messege:"done"})
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