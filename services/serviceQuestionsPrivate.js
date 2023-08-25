const { getQuestion, insertQuestionByOne, insertQuestions , updateQuestions, deleteAllQuestionsOfTest, deleteQuestionInTest} = require('../repositories/repositoryQuestionsPrivate')

serviceQuestionsPrivate={
    getQuestion:async (id) => {
        let inputErrors = []

        if ( id == undefined )
            inputErrors.push(new Error('id is undefined'));
        if (inputErrors.length > 0)
            throw inputErrors

        let question = getQuestion(id);

        
        return question
	},
    insertQuestionByOne:async(numberOfQuestion, code, email, question, answer1, answer2, answer3, answer4, rightAnswer, testId)=>{
        if (numberOfQuestion != undefined && email != undefined && question != undefined && answer1 != undefined && answer2 != undefined && answer3 != undefined && answer4 != undefined && rightAnswer != undefined && testId != undefined) {
            let insertedQuestion = insertQuestionByOne(numberOfQuestion, code, email, question, answer1, answer2, answer3, answer4, rightAnswer, testId)
            return insertedQuestion
        }else{
            throw inputErrors
        }
    },
    insertQuestions:async(listQuestions, email, testId)=>{
        let inputErrors = []
        if(listQuestions<1)
            inputErrors.push(new Error('listQuestions is less then one'))
        if(listQuestions==undefined)
            inputErrors.push(new Error('listQuestions is undefined'))
        if ( email == undefined )
            inputErrors.push(new Error('email is undefined'));
        if ( testId == undefined )
            inputErrors.push(new Error('testId is undefined'));
        if (inputErrors.length > 0)
            throw inputErrors
        let questions=insertQuestions(listQuestions,email, testId)
        return questions
    },
    updateQuestions:async(listQuestions, email)=>{
        let inputErrors = []
        if(listQuestions<1)
            inputErrors.push(new Error('listQuestions is 0'))
        if(listQuestions==undefined)
            inputErrors.push(new Error('listQuestions is undefined'))
        if (inputErrors.length > 0)
            throw inputErrors
        let questions=updateQuestions(listQuestions, email)
        return questions
    },
    deleteAllQuestionsOfTest:async(testId)=>{
        let inputErrors = []

        if ( testId == undefined )
            inputErrors.push(new Error('testId is undefined'));
        if (inputErrors.length > 0)
            throw inputErrors

        let deletedQuestion = deleteAllQuestionsOfTest(testId);

        
        return deletedQuestion
    },
    deleteQuestionInTest:async(numberOfQuestion, testId)=>{
        let inputErrors = []

        if ( testId == undefined )
            inputErrors.push(new Error('testId is undefined'));
        if ( numberOfQuestion == undefined )
            inputErrors.push(new Error('numberOfQuestion is undefined'));
        if (inputErrors.length > 0)
            throw inputErrors

        let deletedQuestion = deleteQuestionInTest(numberOfQuestion, testId);

        
        return deletedQuestion
    },
    
}
module.exports = serviceQuestionsPrivate