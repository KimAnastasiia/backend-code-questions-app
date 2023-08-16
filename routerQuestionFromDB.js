const express = require('express');
const routerQuestionFromDB = express.Router();
const database = require("./database")

routerQuestionFromDB.get("/:email/:nameOfTest", async (req, res) => {
    let email = req.params.email
    let nameOfTest = req.params.nameOfTest
    database.connect();
    try {
        const results = await database.query("SELECT * FROM createdtests WHERE nameOfTest = ? AND email = ?", [nameOfTest, email])
        database.disConnect()
        return res.send(results)
    } catch (error) {
        database.disConnect()
        return res.send({ error: error });
    }
})


module.exports = routerQuestionFromDB