const express = require('express');
const routerQuestions = express.Router();

const { getQuestions, getAnswersOfQuestions, checkAccessUserToken} = require('../controllers/controllerQuestions')

routerQuestions.get("/",checkAccessUserToken )
routerQuestions.get("/:id",getQuestions )
routerQuestions.post("/:id",getAnswersOfQuestions)


module.exports = routerQuestions