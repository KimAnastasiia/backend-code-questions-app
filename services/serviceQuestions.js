const { getQuestions, getAnswersOfQuestions, insertTestResult } = require('../repositories//repositoryQuestions')
const InputError = require('../errros/inputError')
const LogicError = require('../errros/logicError')
const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = '190541474326-dhb8n9vuv9vbd81b9qdit1s0849un5pj.apps.googleusercontent.com';

serviceQuestions = {
    getQuestions: async (id) => {
        let errors = []

        if (id == undefined)
            errors.push(new InputError("id", "id is undefined"));
        if (errors.length > 0)
            throw errors

        let questions = await getQuestions(id);

        if (questions == null)
            errors.push(new LogicError("not possible get questions"));

        // THROW ERROR BUSSINES LOGIC
        if (errors.length > 0)
            throw errors

        return questions
    },
    checkAccessUserToken: async(access_user_token) => {
        let errors = []

        if (access_user_token == undefined)
            errors.push(new InputError("access_user_token", "access_user_token is undefined"));
        if (errors.length > 0)
            throw errors

            if (!access_user_token) {
                errors.push(new InputError("access_user_token",'Access token not provided.' ));
                if (errors.length > 0)
                    throw errors
            }
            
            const client = new OAuth2Client(CLIENT_ID);
            let  tokenInfo
            try {
                tokenInfo = await client.getTokenInfo(
                    access_user_token
                  );
        
                  console.log(tokenInfo)
             
            } catch (error) {
                errors.push(new InputError("access_user_token",'Invalid access token.' ));
                if (errors.length > 0)
                    throw errors
             
            }
            if(tokenInfo!=undefined){
                const payload = tokenInfo;
                return  {message:"successfully"}
            }
    },
    getAnswersOfQuestions: async (id, answers, access_user_token) => {

        let errors = []
        let email
        if (id == undefined)
            errors.push(new InputError("id", "id is undefined"));
        if (answers == undefined)
            errors.push(new InputError("answers", "answers is undefined"));
        if (errors.length > 0)
            throw errors

        if (!access_user_token || access_user_token == "null") {
            email = null
        } else if (access_user_token != null) {

            const client = new OAuth2Client(CLIENT_ID);
            let tokenInfo
            try {
                tokenInfo = await client.getTokenInfo(
                    access_user_token
                );
            } catch (error) {
                errors.push(new InputError("access_user_token",'Invalid access token.'));
                if (errors.length > 0)
                    throw errors
            }
            if (tokenInfo != undefined) {
                const payload = tokenInfo;
                email = payload.email;
            }

        }
        let results = await getAnswersOfQuestions(id);

        if (results == null)
            errors.push(new LogicError("not possible get Answers Of Questions"));

        // THROW ERROR BUSSINES LOGIC
        if (errors.length > 0)
            throw errors

        let answersInTexts = []
        let listOfMarks = []
        let numberOfRightAnswers = 0

        results.forEach((result, inedx) => {

            return answers.forEach((userAnswer) => {

                if (inedx + 1 == userAnswer.questionNumber) {
                    if (result.rightAnswer == userAnswer.answerText) {
                        listOfMarks.push({
                            questionNumber: userAnswer.questionNumber,
                            answer: true,
                            userAnswer: userAnswer.answerText
                        })

                    } else {
                        listOfMarks.push({
                            questionNumber: userAnswer.questionNumber,
                            answer: false,
                            userAnswer: userAnswer.answerText
                        })

                    }

                }
            })
        })

        answers = answers.sort((el1, el2) => el1.questionNumber - el2.questionNumber)

        answers.forEach((answer) => answersInTexts.push(answer.answerText))

        for (let i = 0; i < listOfMarks.length; i++) {
            if (listOfMarks[i].answer == true) {
                numberOfRightAnswers = numberOfRightAnswers + 1
            }
        }
        let percentage = (numberOfRightAnswers / results.length) * 100;
        let result = percentage.toFixed(2) + '% / 100%'
        let currentDate = new Date(Date.now());

        let answerOfInsert = insertTestResult(listOfMarks, id, result,currentDate,answersInTexts, email)

        return answerOfInsert
    },
}
module.exports = serviceQuestions