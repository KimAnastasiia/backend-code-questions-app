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
routerQuestion.post("/:email/:name/:id/",async (req,res)=>{

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
    let email = req.params.email
    let name = req.params.name
    let id = req.params.id
    let answersInTexts= []

    const allText = fs.readFileSync(`./exams/allTests/${email}${name}${id}.txt`, 'utf-8');
    let regex =/Respuesta:\s*([A-D])/g;
    let code = Array.from(allText.matchAll(regex))
    let numberOfRightAnswers =0
    let listRightAnswers = []
    
    code.forEach((el)=>listRightAnswers.push(el[1]))

    let listOfMarks=[]

    listRightAnswers.forEach((rightAnswer, inedx)=>{

        return answers.forEach((userAnswer)=>{

            if(inedx+1==userAnswer.questionNumber){
                if(rightAnswer==userAnswer.answerText){
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
    let percentage = (numberOfRightAnswers /  listRightAnswers.length) * 100;
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


routerQuestion.get("/:email/:name/:id", (req,res)=>{

    let email = req.params.email
    let name = req.params.name
    let id = req.params.id
    let allQuestions =[]
    const allText = fs.readFileSync(`./exams/allTests/${email}${name}${id}.txt`, 'utf-8');
    let regex = /<<<CODE>>>([\s\S]+?)<<<CODE>>>/g;
    let code = Array.from(allText.matchAll(regex))

for(let i=0;i<code.length;i++ ){

    let objectQuestion ={}

    regex = /<<<CODE>>>([\s\S]+?)<<<CODE>>>/g;
    code = Array.from(allText.matchAll(regex))

    objectQuestion.code = code[i][1];

    regex = /-Pregunta([\s\S]+?)<<<CODE>>>/g;
    let questionText =  Array.from(allText.matchAll(regex))

    objectQuestion.questionText = questionText[i][1];

    regex = /^A\..+/gm;
    //match = allText.match(regex);
    let optionA = Array.from(allText.matchAll(regex))

    objectQuestion.optionA = optionA[i][0];

    regex = /^B\..+/gm;
    //match = allText.match(regex);
    let optionB = Array.from(allText.matchAll(regex))

    objectQuestion.optionB = optionB[i][0];

    regex = /^C\..+/gm;
    //match = allText.match(regex);
    let optionC =Array.from(allText.matchAll(regex))

    objectQuestion.optionC = optionC[i][0];

    regex = /^D\..+/gm;
    //match = allText.match(regex);
    let optionD = Array.from(allText.matchAll(regex))

    objectQuestion.optionD = optionD[i][0];

    allQuestions.push(objectQuestion)
}


    res.send(allQuestions)
})

module.exports=routerQuestion