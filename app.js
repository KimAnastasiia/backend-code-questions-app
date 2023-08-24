
const express = require("express")
const multer = require('multer');
const fs = require('fs');
let app = express()

var cors = require('cors');
const routerPublicUsers = require("./routerPublicUsers");
const routerTest = require('./routerTest');
app.use(cors())

app.use(express.static("public"))
app.use(express.json());
var fileUpload = require('express-fileupload');
const routerQuestion = require('./routerQuestion');
const routerTestResults = require('./routerTestResults');
const routerQuestionsPrivate = require('./routerQuestionsPrivate');
const initMiddlewares = require('./middlewares/middlewares');
app.use(fileUpload());
initMiddlewares(app)

app.use("/public/users", routerPublicUsers)
app.use("/test", routerTest)
app.use("/question", routerQuestion)
app.use("/testresults", routerTestResults)
app.use("/questions/private", routerQuestionsPrivate)
app.listen(8080, ()=>{
    console.log("Server in 8081")
})