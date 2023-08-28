let express = require('express');
let crypto = require('crypto');
let controllerQuestionsPrivate = express.Router();
let {getQuestion, insertQuestionByOne, insertQuestions , updateQuestions, deleteAllQuestionsOfTest, deleteQuestionInTest } = require('../services/serviceQuestionsPrivate')

controllerQuestionsPrivate={

    getQuestion: async (req, res) => {
		try {
			let id = req.params.id
			let question = await getQuestion(id)
			res.json(question)
		}
		catch (errors) {
			return res.status(errors[0].code).json({ error: errors} )
		}
	},
    postQuestionByOne:async (req, res) => {
		let {numberOfQuestion, code, question, answer1, answer2, answer3,answer4, rightAnswer } = req.body
		let testId =req.query.testId
		let email = req.googleUserData.email
		try {
			let questionAnswer = await insertQuestionByOne(numberOfQuestion, code, email, question, answer1, answer2,answer3, answer4, rightAnswer, testId)
			return res.json(questionAnswer)
		}
		catch (errors) {
			// ERROR IN USER INPUT DATA
			return res.status(errors[0].code).json({ error: errors} )
		}
	},
    postQuestions:async (req, res) => {
	
            let listQuestions=req.body
            let testId = req.query.testId
            let email = req.googleUserData.email
			try{
				let questions = await insertQuestions(listQuestions, email, testId)
				// ERROR IN SERVER CODE
				return res.json(questions)
			}catch (errors) {
				// ERROR IN USER INPUT DATA
				return res.status(errors[0].code).json({ error: errors} )
			}
	
	},
    putQuestions:async (req, res) => {

		let listOfQuestions=req.body
		let email= req.googleUserData.email
		try{
			let updatedQuestions = await updateQuestions(listOfQuestions, email)
			res.json(updatedQuestions)
		}catch (errors) {
			// ERROR IN USER INPUT DATA
			return res.status(errors[0].code).json({ error: errors} )
		}
		
	},
    deleteAllQuestionsOfTest:async (req, res) => {
        let testId = req.query.testId
		try {
			let deletedQuestions = await deleteAllQuestionsOfTest(testId)
			res.json(deletedQuestions)
		}catch (errors) {
			// ERROR IN USER INPUT DATA
			return res.status(errors[0].code).json({ error: errors} )
		}
	},
    deleteQuestionInTest:async (req, res) => {
        let testId = req.query.testId
        let numberOfQuestion = req.params.numberOfQuestion
		try {
			let deletedQuestion = await deleteQuestionInTest(numberOfQuestion,testId)
			res.json(deletedQuestion)
		}catch (errors) {
			// ERROR IN USER INPUT DATA
			return res.status(errors[0].code).json({ error: errors} )
		}
	},
}


module.exports = controllerQuestionsPrivate