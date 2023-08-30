
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
const initMiddlewares = require('./middlewares/middlewares');
const initRouters = require("./routers/routers");

app.use(fileUpload());
initMiddlewares(app)
initRouters(app);

app.use("/public/users", routerPublicUsers)

app.listen(8080, ()=>{
    console.log("Server in 8081")
})
module.exports = app;