const express = require('express');
const routerTestResults = express.Router();
const database = require("./database")

routerTestResults.get("/", async (req, res) => {
    let testId = req.query.testId
    database.connect();
    try {
        const results = await database.query("SELECT * from testresults WHERE testId=?", [testId])
        database.disConnect()
        return res.send(results)
    } catch (error) {
        database.disConnect()
        return res.send({ error: error });
    }
})

routerTestResults.delete('/', async(req, res) => {
    
    let testId = req.query.testId
    database.connect();

    try{
        await database.query("DELETE FROM testresults WHERE testId=?", [testId])
        database.disConnect();
        res.send({messege:"done"})

    } catch (error){
        return res.send({error: error});
    }
})
module.exports = routerTestResults