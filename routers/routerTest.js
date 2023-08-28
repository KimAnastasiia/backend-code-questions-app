const express = require('express');
const routerTest = express.Router();

const { getTests, getTest, postTestAndQuestions, postTest, putTest, deleteTest} = require('../controllers/controllerTest')

routerTest.get("/",getTests )
routerTest.get("/:id",getTest )
routerTest.post("/",postTestAndQuestions)
routerTest.post("/createdTest",postTest)
routerTest.put("/:id",putTest)
routerTest.delete('/',deleteTest)

module.exports = routerTest