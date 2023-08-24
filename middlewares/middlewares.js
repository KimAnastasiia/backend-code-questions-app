let  authenticationMiddleware  = require("d:/WebEjercicios/node-codemirror/middlewares/authenticationMiddleware")

let initMiddlewares = (app) =>{
    app.use(["/test", "/testresults", "/questions/private"],authenticationMiddleware)
}

module.exports = initMiddlewares;