
const express = require("express")
const multer = require('multer');
const fs = require('fs');
let app = express()

var cors = require('cors');
const routerPublicUsers = require("./routerPublicUsers");
app.use(cors())

app.use(express.static("public"))
app.use(express.json());
var fileUpload = require('express-fileupload');

const routerQuestion = require('./routerQuestion');
const routerTestResults = require('./routerTestResults');


const initMiddlewares = require('./middlewares/middlewares');
const initRouters = require("./routers/routers");

app.use(fileUpload());
initMiddlewares(app)
initRouters(app);

app.use("/public/users", routerPublicUsers)
app.use("/question", routerQuestion)
app.use("/testresults", routerTestResults)

app.listen(8080, ()=>{
    console.log("Server in 8081")
})