const express = require('express');
const routerQuestionFromDB = express.Router();
const database = require("./database")

routerQuestionFromDB.get("/:id", async (req, res) => {
    let id = req.params.id
    database.connect();
    try {
        const results = await database.query("SELECT * FROM createdtests WHERE testId = ?", [id])
        database.disConnect()
        return res.send(results)
    } catch (error) {
        database.disConnect()
        return res.send({ error: error });
    }
})


module.exports = routerQuestionFromDB