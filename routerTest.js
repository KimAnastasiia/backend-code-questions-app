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
        const testsInfo= await database.query("SELECT * from tests WHERE email=?", [req.googleUserData.email])
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
        const test=await database.query("INSERT INTO tests (email, name) VALUES  ( ?, ?) ",[req.googleUserData.email, name])
        file.mv('public/allTests/' +req.googleUserData.email+name+test.insertId+'.txt', async (err) => {

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

module.exports=routerTest