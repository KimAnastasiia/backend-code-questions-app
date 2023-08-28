const {getResults, deleteResults  } = require('../repositories/repositoryTestResults')
const InputError = require('../errros/inputError')
const LogicError = require('../errros/logicError')

serviceTestResults = {
    getResults: async (testId) => {
        let errors = []

        if (testId == undefined)
            errors.push(new InputError("testId", "'testId is undefined"));
        if (errors.length > 0)
            throw errors

        let result = await getResults(testId);

        if (result == null)
            errors.push(new LogicError("not possible get result"));

        // THROW ERROR BUSSINES LOGIC
        if (errors.length > 0)
            throw errors

        return result
    },
    deleteResults: async (testId) => {
        let errors = []
        if (testId == undefined)
            errors.push(new InputError("testId", 'testId is undefined'))
        if (errors.length > 0)
            throw errors
        let info = await deleteResults(testId)

        if (info == null)
            errors.push(new LogicError("not possible delete the results"));
        // THROW ERROR BUSSINES LOGIC
        if (errors.length > 0)
            throw errors

        return info
    },
}
module.exports = serviceTestResults