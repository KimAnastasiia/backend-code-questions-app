const express = require('express');
const crypto = require('crypto');
const routerTest = express.Router();
let keyEncrypt = 'password';
let algorithm = 'aes256'
const sharp = require('sharp');
const database = require("./database")
const fs = require('fs');
const path = require('path');
routerTest.get("/", async (req, res) => {
    database.connect();
    try {
        const testsInfo = await database.query("SELECT * from tests WHERE email=?", [req.googleUserData.email])
        database.disConnect()
        return res.send(testsInfo)
    } catch (error) {
        database.disConnect()
        return res.send({ error: error });
    }
})
routerTest.get("/:id", async (req, res) => {
    let id=req.params.id
    database.connect();
    try {
        const testsInfo = await database.query("SELECT * from tests WHERE email=? and id=?", [req.googleUserData.email, id])
        database.disConnect()
        return res.send(testsInfo)
    } catch (error) {
        database.disConnect()
        return res.send({ error: error });
    }
})
routerTest.post('/', async (req, res) => {

    let file = req.files.myFileTest
    let name = req.body.testName

    database.connect();

    if (file != null) {
        try {
            const test = await database.query("INSERT INTO tests (email, name ) VALUES  (  ?, ?) ", [req.googleUserData.email, name])
            await file.mv('exams/allTests/' + req.googleUserData.email + name + test.insertId + '.txt', async (err) => {

                if (err) {
                    database.disConnect()
                    return res.send({ error: err });
                } else {

                    let email = req.googleUserData.email
                    let id = test.insertId
                    let allQuestions = []
                    const allText = fs.readFileSync(`./exams/allTests/${email}${name}${id}.txt`, 'utf-8');
                    let regex = /<<<CODE>>>([\s\S]+?)<<<CODE>>>/g;
                    let code = Array.from(allText.matchAll(regex))

                    for (let i = 0; i < code.length; i++) {

                        let objectQuestion = {}

                        regex = /<<<CODE>>>([\s\S]+?)<<<CODE>>>/g;
                        code = Array.from(allText.matchAll(regex))

                        objectQuestion.code = code[i][1];

                        regex = /-Pregunta([\s\S]+?)<<<CODE>>>/g;
                        let questionText = Array.from(allText.matchAll(regex))

                        objectQuestion.questionText = questionText[i][1];

                        regex = /^A\..+/gm;
                        //match = allText.match(regex);
                        let optionA = Array.from(allText.matchAll(regex))

                        objectQuestion.optionA = optionA[i][0].slice(3)

                        regex = /^B\..+/gm;
                        //match = allText.match(regex);
                        let optionB = Array.from(allText.matchAll(regex))

                        objectQuestion.optionB = optionB[i][0].slice(3)

                        regex = /^C\..+/gm;
                        //match = allText.match(regex);
                        let optionC = Array.from(allText.matchAll(regex))

                        objectQuestion.optionC = optionC[i][0].slice(3)

                        regex = /^D\..+/gm;
                        //match = allText.match(regex);
                        let optionD = Array.from(allText.matchAll(regex))

                        objectQuestion.optionD = optionD[i][0].slice(3)

                        regex = /Respuesta:\s*([A-D])/g;
                        let rightAnswer = Array.from(allText.matchAll(regex))

                        objectQuestion.rightAnswer = rightAnswer[i][1];
                        objectQuestion.nameOfTest = name

                        allQuestions.push(objectQuestion)

                    }
                    /*[{code:"sd",optionA:"DFDS", optionB:"XCV", optionC:"DFSD", optionD:"5HDF", questionText:'\r\nCompleta el siguiente código\r\n'},{}]*/
                    const filePath = path.join('exams', 'allTests', req.googleUserData.email + name + test.insertId + '.txt');
                    fs.unlink(filePath, (deleteErr) => {
                        if (deleteErr) {
                          // Handle error while deleting
                          console.error('Error deleting file:', deleteErr);
                        } else {
                          console.log('File deleted successfully.');
                        }
                      });
                    allQuestions.forEach(async (el, index) => {

                        try {
                            await database.connect()
                            await database.query(
                                "INSERT INTO questions ( numberOfQuestion, code, email, question, answer1, answer2, answer3, answer4, rightAnswer,testId ) VALUES  ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                                [(index+1), el.code, req.googleUserData.email, el.questionText, el.optionA, el.optionB, el.optionC, el.optionD, el.rightAnswer, id])
                                await database.disConnect()
                                res.send({ messege: "done" })
                        } catch (er) {
                            await database.disConnect()
                        }


                    })
                }
            })

        } catch (error) {
            database.disConnect()
            res.send({ message: "error" })
        }
    }
})
routerTest.put("/:id", async (req, res) => {
    let newName=req.body.name
    let id=req.params.id
    database.connect()
   
        try {
            await database.query("UPDATE tests SET  name=? where email=? and id=? ",
            [ newName, req.googleUserData.email, id])
            database.disConnect()
            return res.send({ message: "done" });
        } catch (error) {
            database.disConnect()
            return res.send({ error: error })
        }
})
routerTest.delete('/', async (req, res) => {

    let testId = req.query.testId
    database.connect();

    try {
        await database.query("DELETE FROM tests WHERE id=?", [testId])
        database.disConnect();
        res.send({ messege: "done" })

    } catch (error) {
        return res.send({ error: error });
    }
})
routerTest.post('/createdTest', async (req, res) => {
    let name = req.query.testName

    database.connect();


    try {
        let inseredInfo = await database.query("INSERT INTO tests (email, name ) VALUES  ( ?, ?) ", [req.googleUserData.email, name])
        database.disConnect();
        res.send({
            messege: "done",
            insertId: inseredInfo.insertId
        })
    } catch (error) {
        database.disConnect();
        res.send({ message: "error" })
    }

})
module.exports = routerTest