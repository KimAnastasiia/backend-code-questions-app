let express = require('express');
let crypto = require('crypto');
let controllerQuestionsPrivate = express.Router();
let {getQuestion, insertQuestionByOne, insertQuestions , updateQuestions, deleteAllQuestionsOfTest, deleteQuestionInTest } = require('../services/serviceQuestionsPrivate')

controllerQuestionsPrivate={

    getQuestion: async (req, res) => {
		try {
			let id = req.params.id
			let question = await getQuestion(id)
			if ( question == null){
				// ERROR IN SERVER CODE
				res.status(500).json({ error: "error getting question"})	
			} 

			res.json(question)
		}
		catch (e) {
			// ERROR IN USER INPUT DATA
			res.status(400).json({ error: e.map( error => error.message ) })
		}
	},
    postQuestionByOne:async (req, res) => {
		try {
			let question = await insertQuestionByOne(req.body.numberOfQuestion, req.body.code, req.googleUserData.email, req.body.question, req.body.answer1, req.body.answer2, req.body.answer3, req.body.answer4, req.body.rightAnswer, req.query.testId)
			if ( question == null){
				// ERROR IN SERVER CODE
				res.status(500).json({ error: "error insert question"})	
			} 

			res.json(question)
		}
		catch (e) {
			// ERROR IN USER INPUT DATA
			res.status(400).json({ error: e.map( error => error.message ) })
		}
	},
    postQuestions:async (req, res) => {
		try {
            let listQuestions=req.body
            let testId = req.query.testId
            let email = req.googleUserData.email
			let questions = await insertQuestions(listQuestions, email, testId)
			if ( questions == null){
				// ERROR IN SERVER CODE
				res.status(500).json({ error: "error insert questions"})	
			} 

			res.json(questions)
		}
		catch (e) {
			// ERROR IN USER INPUT DATA
			res.status(400).json({ error: e.map( error => error.message ) })
		}
	},
    putQuestions:async (req, res) => {
		try {
            let listOfQuestions=req.body
            let email= req.googleUserData.email
			let updatedQuestions = await updateQuestions(listOfQuestions, email)
			if ( updatedQuestions == null){
				// ERROR IN SERVER CODE
				res.status(500).json({ error: "error update questions"})	
			} 

			res.json(updatedQuestions)
		}
		catch (e) {
			// ERROR IN USER INPUT DATA
			res.status(400).json({ error: e.map( error => error.message ) })
		}
	},
    deleteAllQuestionsOfTest:async (req, res) => {
        let testId = req.query.testId
		try {
			let deletedQuestions = await deleteAllQuestionsOfTest(testId)
			if ( deletedQuestions == null){
				// ERROR IN SERVER CODE
				res.status(500).json({ error: "error update questions"})	
			} 

			res.json(deletedQuestions)
		}
		catch (e) {
			// ERROR IN USER INPUT DATA
			res.status(400).json({ error: e.map( error => error.message ) })
		}
	},
    deleteQuestionInTest:async (req, res) => {
        let testId = req.query.testId
        let numberOfQuestion = req.params.numberOfQuestion
		try {
			let deletedQuestion = await deleteQuestionInTest(numberOfQuestion,testId)
			if ( deletedQuestion == null){
				// ERROR IN SERVER CODE
				res.status(500).json({ error: "error update questions"})	
			} 

			res.json(deletedQuestion)
		}
		catch (e) {
			// ERROR IN USER INPUT DATA
			res.status(400).json({ error: e.map( error => error.message ) })
		}
	},
}


module.exports = controllerQuestionsPrivate