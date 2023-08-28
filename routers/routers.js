const routerQuestionsPrivate = require("./routerQuestionsPrivate")
const routerTest = require("./routerTest")
const routerTestResults = require("./routerTestResults")

let initRouters = (app) =>{
    app.use("/questions/private",routerQuestionsPrivate)
    app.use("/test",routerTest)
    app.use("/testresults",routerTestResults)
    /*
    
    app.use("/question",)
    app.use("/test",)
    app.use("/public/users",)
    */
}

module.exports = initRouters;