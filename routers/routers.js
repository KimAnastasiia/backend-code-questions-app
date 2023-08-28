const routerQuestionsPrivate = require("./routerQuestionsPrivate")
const routerTest = require("./routerTest")

let initRouters = (app) =>{
    app.use("/questions/private",routerQuestionsPrivate)
    app.use("/test",routerTest)
    /*
    app.use("/testresults",)
    app.use("/question",)
    app.use("/test",)
    app.use("/public/users",)
    */
}

module.exports = initRouters;