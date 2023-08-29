let express = require('express');
let crypto = require('crypto');
let controllerQuestions = express.Router();
let { getQuestions , getAnswersOfQuestions, checkAccessUserToken} = require('../services/serviceQuestions')

controllerQuestions={
    getQuestions: async (req, res) => {
		try {
			let id = req.params.id
			let questions = await getQuestions(id)
			res.json(questions)
		}
		catch (errors) {
			return res.status(errors[0].code).json({ error: errors} )
		}
	},   
    checkAccessUserToken: async (req, res) => {
		try {
			const { access_user_token } = req.query;
			let answer = await checkAccessUserToken(access_user_token)
			res.json(answer)
		}
		catch (errors) {
			return res.status(errors[0].code).json({ error: errors} )
		}
	},   
    getAnswersOfQuestions: async (req, res) => {
		try {
            const { access_user_token } = req.query;
			let id = req.params.id
            let answers= req.body//[{},{},{}]
			let results = await getAnswersOfQuestions(id, answers, access_user_token)
			res.json(results)
		}
		catch (errors) {
			return res.status(errors[0].code).json({ error: errors} )
		}
	}
}

module.exports = controllerQuestions