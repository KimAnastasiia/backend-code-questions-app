const { getQuestion, insertQuestionByOne, insertQuestions, updateQuestions, deleteAllQuestionsOfTest, deleteQuestionInTest } = require('../repositories/repositoryQuestionsPrivate')
const InputError = require('../errros/inputError')
const LogicError = require('../errros/logicError')

serviceQuestionsPrivate = {
    getQuestion: async (id) => {
        let errors = []

        if (id == undefined)
            errors.push(new InputError("id", "not found id"));

        // THROW ERROR INPUT
        if (errors.length > 0)
            throw errors

        let question = await getQuestion(id);

        if (question == null)
            errors.push(new LogicError("not possible get the question"));

        // THROW ERROR BUSSINES LOGIC
        if (errors.length > 0)
            throw errors

        return question
    },
    insertQuestionByOne: async (numberOfQuestion, code, email, question, answer1, answer2, answer3, answer4, rightAnswer, testId) => {
        let errors = []

        if (numberOfQuestion == undefined)
            errors.push(new InputError("numberOfQuestion", "not found numberOfQuestion"));
        if (code == undefined)
            errors.push(new InputError("code", "not found code"));
        if (email == undefined)
            errors.push(new InputError("email", "not found email"));
        if (question == undefined)
            errors.push(new InputError("question", "not found question"));
        if (answer1 == undefined)
            errors.push(new InputError("answer1", "not found answer1"))
        if (answer2 == undefined)
            errors.push(new InputError("answer2", "not found answer2"));
        if (answer3 == undefined)
            errors.push(new InputError("answer3", "not found answer3"));
        if (answer4 == undefined)
            errors.push(new InputError("answer4", "not found answer4"));
        if (rightAnswer != "A" && rightAnswer != "B" && rightAnswer != "C" && rightAnswer != "D"&& rightAnswer != "")
            errors.push(new InputError("rightAnswer", "not valid value"));
        if (testId == undefined)
            errors.push(new InputError("testId", "not found testId"));
        if (errors.length > 0)
            throw errors


        let insertedQuestion = await insertQuestionByOne(numberOfQuestion, code, email, question, answer1, answer2, answer3, answer4, rightAnswer, testId)

        if (insertedQuestion == null)
            errors.push(new LogicError("error in insert questions"));

        if (errors.length > 0)
            throw errors

        return insertedQuestion
    },
    insertQuestions: async (listQuestions, email, testId) => {
        let errors = []

        if (listQuestions < 1)
            errors.push(new InputError("listQuestions", "listQuestions is less then one"));
        if (listQuestions == undefined)
            errors.push(new InputError("listQuestions", "listQuestions is undefined"));
        if (email == undefined)
            errors.push(new InputError("email", "email is undefined"));
        if (testId == undefined)
            errors.push(new InputError("testId", "testId is undefined"));

        if (errors.length > 0)
            throw errors

        let questions = []
        listQuestions.forEach(async (el, index) => {
            let result = await insertQuestions((index + 1), el.code, email, el.question, el.answer1, el.answer2, el.answer3, el.answer4, el.rightAnswer, testId)
            questions.push(result)
        })
        if (questions.find((question) => question == null) != undefined)
            errors.push(new LogicError("error in insert questions"))

        if (errors.length > 0)
            throw errors

        return questions
    },
    updateQuestions: async (listQuestions, email) => {
        let errors = []
        if (listQuestions < 1)
            errors.push(new InputError("listQuestions", "listQuestions is 0"));

        if (listQuestions == undefined)
            errors.push(new InputError("listQuestions", "listQuestions is undefined"));

        if (email == undefined)
            errors.push(new InputError("email", "email is undefined"));

        if (errors.length > 0)
            throw errors

        let updatedQuestionsAnswer = []

        listQuestions.forEach(async (test) => {
            let result = await updateQuestions(test.question, test.answer1, test.answer2, test.answer3, test.answer4, test.rightAnswer, test.code, test.testId, test.numberOfQuestion, email)
            updatedQuestionsAnswer.push(result)
        })

        if (updatedQuestionsAnswer.find((question) => question == null) != undefined)
            errors.push(new LogicError("error in update questions"))

        if (errors.length > 0)
            throw errors

        return updatedQuestionsAnswer
    },
    deleteAllQuestionsOfTest: async (testId) => {
        let errors = []

        if (testId == undefined)
            errors.push(new InputError("testId", "testId is undefined"));
        if (errors.length > 0)
            throw errors

        let deletedQuestion = deleteAllQuestionsOfTest(testId);
        if (deletedQuestion == null)
            errors.push(new LogicError("error in delete questions"))

        if (errors.length > 0)
            throw errors

        return deletedQuestion
    },
    deleteQuestionInTest: async (numberOfQuestion, testId) => {
        let errors = []

        if (testId == undefined)
            errors.push(new InputError("testId", "testId is undefined"));
        if (numberOfQuestion == undefined)
            errors.push(new InputError("numberOfQuestion", "numberOfQuestion is undefined"));

        if (errors.length > 0)
            throw errors
        let deletedQuestion = deleteQuestionInTest(numberOfQuestion, testId);
        if (deletedQuestion == null)
            if (errors.length > 0)
                throw errors
        return deletedQuestion
    },

}
module.exports = serviceQuestionsPrivate