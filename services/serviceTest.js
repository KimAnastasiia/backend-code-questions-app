const { getTests, getTest, insertTests, insertTest, updateTest, deleteTest } = require('../repositories/repositoryTest')
const {insertQuestions  } = require('../repositories/repositoryQuestionsPrivate')
const InputError = require('../errros/inputError')
const LogicError = require('../errros/logicError')
serviceTest = {
    getTests: async (email) => {
        let errors = []

        if (email == undefined)
            errors.push(new InputError("email", "email is undefined"));
        if (errors.length > 0)
            throw errors

        let tests = await getTests(email);

        if (tests == null)
            errors.push(new LogicError("not possible get tests"));

        // THROW ERROR BUSSINES LOGIC
        if (errors.length > 0)
            throw errors

        return tests
    },
    getTest: async (email, id) => {
        let errors = []

        if (email == undefined)
            errors.push(new InputError("email", 'email is undefined'));
        if (id == undefined)
            errors.push(new InputError("id", 'id is undefined'));

        if (errors.length > 0)
            throw errors

        let test = await getTest(email, id);

        if (test == null)
            errors.push(new LogicError("not possible get test"));

        if (errors.length > 0)
            throw errors

        return test
    },
    insertTestAndQuestions: async (email, file, name) => {
        let errors = []

        if (email == undefined)
            errors.push(new InputError("email", 'email is undefined'));
        if (file == undefined)
            errors.push(new InputError("file", 'file is undefined'));
        if (name == undefined)
            errors.push(new InputError("name", 'name is undefined'));
        if (errors.length > 0)
            throw errors

        let createdTestId = await insertTests(email, name)

        if (createdTestId == null)
            errors.push(new LogicError("not possible post test"));

        if (errors.length > 0)
            throw errors

        let allText = file.data.toString();
        let id = createdTestId
        let allQuestions = []
        //const allText = fs.readFileSync(`./exams/allTests/${email}${name}${id}.txt`, 'utf-8');
        let regex = /<<<CODE>>>([\s\S]+?)<<<CODE>>>/g;
        let code = Array.from(allText.matchAll(regex))

        for (let i = 0; i < code.length; i++) {

            let objectQuestion = {}

            regex = /<<<CODE>>>([\s\S]+?)<<<CODE>>>/g;
            code = Array.from(allText.matchAll(regex))

            objectQuestion.code = code[i][1];

            regex = /-Pregunta([\s\S]+?)<<<CODE>>>/g;
            let questionText = Array.from(allText.matchAll(regex))

            objectQuestion.questionText = questionText[i][1];

            if(objectQuestion.questionText==undefined || objectQuestion.questionText=="" || objectQuestion.questionText=='\r\n\r\n')
                errors.push(new InputError("questionText", `questionText in question ${(i+1)} is undefined`));

            regex = /^A\..+/gm;
            //match = allText.match(regex);
            let optionA = Array.from(allText.matchAll(regex))

            objectQuestion.optionA = optionA[i][0].slice(3)

            if(objectQuestion.optionA==undefined || objectQuestion.optionA=="")
                errors.push(new InputError("optionA", `optionA in question ${(i+1)} is undefined`));

            regex = /^B\..+/gm;
            //match = allText.match(regex);
            let optionB = Array.from(allText.matchAll(regex))

            objectQuestion.optionB = optionB[i][0].slice(3)

            
            if(objectQuestion.optionB==undefined || objectQuestion.optionB=="")
                errors.push(new InputError("optionB", `optionB in question ${(i+1)} is undefined`));

            regex = /^C\..+/gm;
            //match = allText.match(regex);
            let optionC = Array.from(allText.matchAll(regex))

            objectQuestion.optionC = optionC[i][0].slice(3)

            if(objectQuestion.optionC==undefined || objectQuestion.optionC=="")
                errors.push(new InputError("optionB",` optionB in question ${(i+1)} is undefined`));

            regex = /^D\..+/gm;
            //match = allText.match(regex);
            let optionD = Array.from(allText.matchAll(regex))

            objectQuestion.optionD = optionD[i][0].slice(3)
  
            if(objectQuestion.optionD==undefined || objectQuestion.optionD=="")
                errors.push(new InputError("optionD", `optionD in question ${(i+1)} is undefined`));

            regex = /Respuesta:\s*([A-D])/g;
            let rightAnswer = Array.from(allText.matchAll(regex))

            if(rightAnswer.length==0)
                errors.push(new InputError("rightAnswer", `rightAnswer in question ${(i+1)} is undefined`));
            else
                objectQuestion.rightAnswer = rightAnswer[i][1];

            if(objectQuestion.rightAnswer==undefined || objectQuestion.rightAnswer=="")
                errors.push(new InputError("rightAnswer", `rightAnswer in question ${(i+1)} is undefined`));

            objectQuestion.nameOfTest = name

            if(objectQuestion.nameOfTest==undefined || objectQuestion.nameOfTest=="")
                errors.push(new InputError("nameOfTest", `nameOfTest in question ${(i+1)} is undefined`));

            if (errors.length > 0)
                throw errors

            allQuestions.push(objectQuestion)
        }
        let anwers = []
        allQuestions.forEach(async (el, index) => {
            let result = await insertQuestions((index + 1), el.code, email, el.questionText, el.optionA, el.optionB, el.optionC, el.optionD, el.rightAnswer, id)
            anwers.push(result)
        })
        if (anwers.find((answer) => answer == null) != undefined)
            errors.push(new LogicError("error in insert questions"))

        if (errors.length > 0)
            throw errors

        return true
    },
    insertTest: async (name, email) => {
        let errors = []

        if (email == undefined)
            errors.push(new InputError("email", 'email is undefined'));
        if (name == undefined)
            errors.push(new Error("name", 'name is undefined'));
        if (errors.length > 0)
            throw errors

        let info = await insertTest(name, email);

        if (info == null)
            errors.push(new LogicError("not possible insert the test"));

        // THROW ERROR BUSSINES LOGIC
        if (errors.length > 0)
            throw errors

        return info
    },
    updateTest: async (newName, email, id) => {
        let errors = []
        if (newName == undefined)
            errors.push(new InputError("newName", 'newName is undefined'))
        if (email == undefined)
            errors.push(new InputError("email", 'email is undefined'))
        if (id == undefined)
            errors.push(new InputError("id", 'id is undefined'))
        if (errors.length > 0)
            throw errors
        let info = await updateTest(newName, email, id)

        if (info == null)
            errors.push(new LogicError("not possible put the test"));

        // THROW ERROR BUSSINES LOGIC
        if (errors.length > 0)
            throw errors

        return info
    },
    deleteTest: async (testId) => {
        let errors = []
        if (testId == undefined)
            errors.push(new InputError("testId", 'testId is undefined'))
        if (errors.length > 0)
            throw errors
        let info = await deleteTest(testId)

        if (info == null)
            errors.push(new LogicError("not possible delete the test"));
        // THROW ERROR BUSSINES LOGIC
        if (errors.length > 0)
            throw errors

        return info
    },
}
module.exports = serviceTest