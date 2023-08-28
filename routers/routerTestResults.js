const express = require('express');
const routerTestResults = express.Router();
const {getResults, deleteResults} = require('../controllers/controllerTestResults')
routerTestResults.get("/", getResults)
routerTestResults.delete('/', deleteResults)

module.exports = routerTestResults