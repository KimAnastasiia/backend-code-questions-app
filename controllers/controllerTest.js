let express = require('express');
let controllerTest = express.Router();
const { getTests, getTest, insertTestAndQuestions, insertTest, updateTest, deleteTest } = require('../services/serviceTest')

controllerTest = {
    getTests: async (req, res) => {
        try {
            let email = req.googleUserData.email
            let tests = await getTests(email)
            res.json(tests)
        } catch (errors) {
			return res.status(errors[0].code).json({ error: errors} )
		}
    },
    getTest: async (req, res) => {
        try {
            let email = req.googleUserData.email
            let id = req.params.id
            let test = await getTest(email, id)
            res.json(test)
        }catch (errors) {
			return res.status(errors[0].code).json({ error: errors} )
		}
    },
    postTestAndQuestions: async (req, res) => {
        try {
            let file = req.files.myFileTest
            let name = req.body.testName
            let email = req.googleUserData.email
            let insertedTest = await insertTestAndQuestions(email, file, name)
            res.json(insertedTest)
        }
        catch (errors) {
			return res.status(errors[0].code).json({ error: errors} )
		}
    },
    postTest: async (req, res) => {
        try {
            let name = req.query.testName
            let email = req.googleUserData.email
            let inseredInfo = await insertTest(name, email)
            res.json({
                messege: "done",
                insertId: inseredInfo.insertId
            })
        }catch (errors) {
			return res.status(errors[0].code).json({ error: errors} )
		}
    },
    putTest:async (req, res) => {
		try {
            let newName=req.body.name
            let id=req.params.id
            let email= req.googleUserData.email
			let updatedTestInfo = await updateTest(newName, email, id)
			res.json(updatedTestInfo)
		}catch (errors) {
			return res.status(errors[0].code).json({ error: errors} )
		}
	},
    deleteTest:async (req, res) => {
        let testId = req.query.testId

		try {
			let deletedTtest = await deleteTest(testId)
			res.json(deletedTtest)
		}catch (errors) {
			return res.status(errors[0].code).json({ error: errors} )
		}
	},
}
module.exports = controllerTest