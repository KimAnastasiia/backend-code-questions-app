const express = require('express');
const crypto = require('crypto');
const routerTest = express.Router();
let keyEncrypt = 'password';
let algorithm = 'aes256'
const sharp = require('sharp');
const database= require("./database")

routerTest.get("/",async(req,res)=>{
    database.connect();
    try{
        const testsInfo= await database.query("SELECT * from tests WHERE email=? and created = 0", [req.googleUserData.email])
        database.disConnect()
        return  res.send(testsInfo)
    }catch(error){
        database.disConnect()
        return res.send({error:error});
    }
})
routerTest.get("/created",async(req,res)=>{
    database.connect();
    try{
        const testsInfo= await database.query("SELECT * from tests WHERE email=? and created = 1", [req.googleUserData.email])
        database.disConnect()
        return  res.send(testsInfo)
    }catch(error){
        database.disConnect()
        return res.send({error:error});
    }
})
routerTest.post('/', async(req, res) => {

    let file = req.files.myFileTest
    let name =  req.body.testName
    
    database.connect();

    if (file != null) {
    try{
        const test=await database.query("INSERT INTO tests (email, name, created ) VALUES  ( ?, ?, ?) ",[req.googleUserData.email, name, 0])
        file.mv('exams/allTests/' +req.googleUserData.email+name+test.insertId+'.txt', async (err) => {

            if(err){
                database.disConnect()
                return res.send({error:err });
            }

            database.disConnect()
            return res.send({message:"done",
                rows:test
            });
        })
    }catch (error){
        res.send({message:"error"})
    }
    }
})
routerTest.delete('/', async(req, res) => {
    
    let testId = req.query.testId
    database.connect();

    try{
        await database.query("DELETE FROM tests WHERE id=?", [testId])
        database.disConnect();
        res.send({messege:"done"})

    } catch (error){
        return res.send({error: error});
    }
})
routerTest.post('/createdTest', async(req, res) => {
    let name =  req.query.testName
    
    database.connect();


    try{
        let inseredInfo = await database.query("INSERT INTO tests (email, name, created ) VALUES  ( ?, ?, ?) ",[req.googleUserData.email, name, 1])
        database.disConnect();
        res.send({messege:"done",
        insertId:inseredInfo.insertId})
    }catch (error){
        database.disConnect();
        res.send({message:"error"})
    }
    
})
module.exports=routerTest