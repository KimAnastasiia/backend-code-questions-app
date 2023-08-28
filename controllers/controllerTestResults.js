let express = require('express');
let controllerTestResults = express.Router();
const { getResults, deleteResults } = require('../services/serviceTestResults')

controllerTestResults = {

    getResults: async (req, res) => {
        try {
            let testId = req.query.testId
            let results = await getResults(testId)
            res.json(results)
        } catch (errors) {
            return res.status(errors[0].code).json({ error: errors })
        }
    },
    deleteResults: async (req, res) => {
        let testId = req.query.testId

        try {
            let answer = await deleteResults(testId)
            res.json(answer)
        } catch (errors) {
            return res.status(errors[0].code).json({ error: errors })
        }
    },
}
module.exports = controllerTestResults