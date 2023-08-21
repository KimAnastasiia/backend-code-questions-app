
const { OAuth2Client } = require('google-auth-library');
const express = require("express")
const multer = require('multer');
const fs = require('fs');
const CLIENT_ID = '190541474326-dhb8n9vuv9vbd81b9qdit1s0849un5pj.apps.googleusercontent.com';
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
app.use(fileUpload());

app.use(["/test", "/testresults", "/questions/private"],async(req,res,next)=>{

    const { access_token } = req.query;
    
    if (!access_token) {
        return res.status(400).json({ error: 'Access token not provided.' });
    }
    
    const client = new OAuth2Client(CLIENT_ID);
    let  tokenInfo
    try {
        tokenInfo = await client.getTokenInfo(
            access_token
          );

          console.log(tokenInfo)
     
    } catch (error) {
        return res.status(401).json({ error: 'Invalid access token.' });
    }
    if(tokenInfo!=undefined){
    const payload = tokenInfo;
    req.googleUserData = payload; // You can access the user data in your route handlers using req.googleUserData
    next();
    }
})

/*

app.use("",async(req,res,next)=>{
    let apiKey = req.query.apiKey

    let obj = objectOfApiKey.find((obj)=>
      obj===apiKey
    )
    if(!obj){
        res.send({error:"error"})
        return
    }

    let infoInToken = jwt.verify(apiKey, "secret");
    req.infoInToken = infoInToken;

    next()
})
**/

app.use("/public/users", routerPublicUsers)
app.use("/test", routerTest)
app.use("/question", routerQuestion)
app.use("/testresults", routerTestResults)
app.use("/questions/private", routerQuestionsPrivate)
app.listen(8080, ()=>{
    console.log("Server in 8081")
})