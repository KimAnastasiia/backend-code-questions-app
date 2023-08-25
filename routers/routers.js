const routerQuestionsPrivate = require("./routerQuestionsPrivate")


let initRouters = (app) =>{
    app.use("/questions/private",routerQuestionsPrivate)
    /*
    app.use("/testresults",)
    app.use("/question",)
    app.use("/test",)
    app.use("/public/users",)
    */
}

module.exports = initRouters;