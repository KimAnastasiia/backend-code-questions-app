const express = require('express');
const crypto = require('crypto');
const routerQuestion = express.Router();
let keyEncrypt = 'password';
let algorithm = 'aes256'
const sharp = require('sharp');
const database= require("./database")
const fs = require('fs');
const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = '190541474326-dhb8n9vuv9vbd81b9qdit1s0849un5pj.apps.googleusercontent.com';

routerQuestion.get("/",async(req,res)=>{

    const { access_user_token } = req.query;
    
    if (!access_user_token) {
        return res.status(400).json({ error: 'Access token not provided.' });
    }
    
    const client = new OAuth2Client(CLIENT_ID);
    let  tokenInfo
    try {
        tokenInfo = await client.getTokenInfo(
            access_user_token
          );

          console.log(tokenInfo)
     
    } catch (error) {
        return res.status(401).json({ error: 'Invalid access token.' });
    }
    if(tokenInfo!=undefined){
        const payload = tokenInfo;
        req.googleUserEmail = payload; // You can access the user data in your route handlers using req.googleUserData
        return  res.send({message:"successfully"})
    }
})
routerQuestion.post("/:id/",async (req,res)=>{

    const { access_user_token } = req.query;
    
    if (!access_user_token ||access_user_token =="null" ) {
        req.googleUserEmail=null
    }else if (access_user_token!=null ){
    
        const client = new OAuth2Client(CLIENT_ID);
        let  tokenInfo
        try {
            tokenInfo = await client.getTokenInfo(
                access_user_token
            );

            console.log(tokenInfo)
        
        } catch (error) {
            return res.status(401).json({ error: 'Invalid access token.' });
        }
        if(tokenInfo!=undefined){
            const payload = tokenInfo;
            req.googleUserEmail = payload.email; // You can access the user data in your route handlers using req.googleUserData
        }

    }

    let answers= req.body//[{},{},{}]
    let currentDate = new Date(Date.now());
    let id = req.params.id
    let answersInTexts= []


    let numberOfRightAnswers =0
    let results = []
    
    database.connect();
    try {
        results = await database.query("SELECT * FROM questions WHERE testId= ?", [id])
        database.disConnect()
    } catch (error) {
        database.disConnect()
        return res.send({ error: error });
    }


    let listOfMarks=[]

    results.forEach((result, inedx)=>{

        return answers.forEach((userAnswer)=>{

            if(inedx+1==userAnswer.questionNumber){
                if(result.rightAnswer==userAnswer.answerText){
                    listOfMarks.push({
                        questionNumber:userAnswer.questionNumber,
                        answer:true,
                        userAnswer:userAnswer.answerText
                     })
                    
                }else{
                    listOfMarks.push({
                        questionNumber:userAnswer.questionNumber,
                        answer:false,
                        userAnswer:userAnswer.answerText
                     })
                 
                }
                
            }
        })
    })

    answers = answers.sort((el1, el2)=>el1.questionNumber-el2.questionNumber)
    
    answers.forEach((answer)=>answersInTexts.push(answer.answerText))

    for(let i=0; i<listOfMarks.length; i++){
        if(listOfMarks[i].answer==true){ 
            numberOfRightAnswers= numberOfRightAnswers+1
        }
    }
    let percentage = (numberOfRightAnswers /  results.length) * 100;
    let result = percentage.toFixed(2) + '% / 100%'
    database.connect()

    try{
        await database.query("INSERT INTO testresults (testId, result, date, answers, email ) VALUES  (?, ?, ?, ?, ?)", [ id, result, currentDate, answersInTexts.join(","), req.googleUserEmail ])
        database.disConnect()
        res.send({
            listOfMarks:listOfMarks,
            mark:result
            }
            )
    }catch(error){
        database.disConnect()
        return res.send({error:error})
    }
    
})


routerQuestion.get("/:id", async(req,res)=>{

    let id = req.params.id
    database.connect();
    try {
        const results = await database.query("SELECT email, question, answer1, answer2, answer3, answer4, code  FROM questions WHERE testId = ?", [id])
        database.disConnect()
        return res.send(results)
    } catch (error) {
        database.disConnect()
        return res.send({ error: error });
    }
})

module.exports=routerQuestion