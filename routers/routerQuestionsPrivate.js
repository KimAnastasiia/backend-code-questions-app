const express = require('express');
const crypto = require('crypto');
const routerQuestionsPrivate = express.Router();
const database = require("../database")
const { getQuestion, postQuestionByOne, postQuestions, putQuestions, deleteAllQuestionsOfTest,deleteQuestionInTest} = require('../controllers/controllerQuestionsPrivate')

routerQuestionsPrivate.get("/:id", getQuestion)
routerQuestionsPrivate.post("/",postQuestions)
routerQuestionsPrivate.post("/addByOne",postQuestionByOne )
routerQuestionsPrivate.put("/",putQuestions)
routerQuestionsPrivate.delete('/',deleteAllQuestionsOfTest)
routerQuestionsPrivate.delete('/:numberOfQuestion', deleteQuestionInTest)


module.exports = routerQuestionsPrivate