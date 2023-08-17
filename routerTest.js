const express = require('express');
const crypto = require('crypto');
const routerTest = express.Router();
let keyEncrypt = 'password';
let algorithm = 'aes256'
const sharp = require('sharp');
const database = require("./database")
const fs = require('fs');
routerTest.get("/", async (req, res) => {
    database.connect();
    try {
        const testsInfo = await database.query("SELECT * from tests WHERE email=? and created = 0", [req.googleUserData.email])
        database.disConnect()
        return res.send(testsInfo)
    } catch (error) {
        database.disConnect()
        return res.send({ error: error });
    }
})
routerTest.get("/created", async (req, res) => {
    database.connect();
    try {
        const testsInfo = await database.query("SELECT * from tests WHERE email=? and created = 1", [req.googleUserData.email])
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
            const test = await database.query("INSERT INTO tests (email, name, created ) VALUES  ( ?, ?, ?) ", [req.googleUserData.email, name, 0])
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

                        objectQuestion.optionA = optionA[i][0];

                        regex = /^B\..+/gm;
                        //match = allText.match(regex);
                        let optionB = Array.from(allText.matchAll(regex))

                        objectQuestion.optionB = optionB[i][0];

                        regex = /^C\..+/gm;
                        //match = allText.match(regex);
                        let optionC = Array.from(allText.matchAll(regex))

                        objectQuestion.optionC = optionC[i][0];

                        regex = /^D\..+/gm;
                        //match = allText.match(regex);
                        let optionD = Array.from(allText.matchAll(regex))

                        objectQuestion.optionD = optionD[i][0];

                        regex = /Respuesta:\s*([A-D])/g;
                        let rightAnswer = Array.from(allText.matchAll(regex))

                        objectQuestion.rightAnswer = rightAnswer[i][1];
                        objectQuestion.nameOfTest = name

                        allQuestions.push(objectQuestion)

                    }
                    /*[{code:"sd",optionA:"DFDS", optionB:"XCV", optionC:"DFSD", optionD:"5HDF", questionText:'\r\nCompleta el siguiente código\r\n'},{}]*/
                    allQuestions.forEach(async (el) => {

                        try {
                            await database.connect()
                            await database.query(
                                "INSERT INTO createdtests ( code, email, question, answer1, answer2, answer3, answer4, rightAnswer, nameOfTest, testId ) VALUES  (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                                [el.code, req.googleUserData.email, el.questionText, el.optionA, el.optionB, el.optionC, el.optionD, el.rightAnswer, el.nameOfTest, id])
                            await database.disConnect()
                        } catch (er) {
                            await database.disConnect()
                        }


                    })
                }

                database.disConnect()
                res.send({ messege: "done" })


            })

        } catch (error) {
            database.disConnect()
            res.send({ message: "error" })
        }
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
        let inseredInfo = await database.query("INSERT INTO tests (email, name, created ) VALUES  ( ?, ?, ?) ", [req.googleUserData.email, name, 1])
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