const express = require('express');
const crypto = require('crypto');
const routerPublicUsers = express.Router();
let keyEncrypt = 'password';
let algorithm = 'aes256'
const objectOfApiKey = require("./objectApiKey")
const jwt = require("jsonwebtoken");
let fs=require("fs")
const database= require("./database")

routerPublicUsers.get("/",async(req,res)=>{
    let email = req.query.email
    database.connect();
    try{
        const user= await database.query("SELECT email from user WHERE email=?", [email])
        if(user.length>0){
            database.disConnect()
            return  res.send({message:"user exist"})
        }else{
            database.disConnect()
            return  res.send({message:"user does not exist"})
        }

    }catch(error){
        database.disConnect()
        return res.send({error:error});
    }
})
routerPublicUsers.put("/",async(req,res)=>{
    let email = req.body.email
    let password = req.body.password;
    let cipher = crypto.createCipher(algorithm, keyEncrypt);
    let passwordEncript = cipher.update(password, 'utf8', 'hex') + cipher.final('hex');
    database.connect()

    try{
        await database.query("UPDATE user SET password=? where email=? ", [passwordEncript, email])
        database.disConnect()
        return res.send({message:"done"});
    }catch(error){
        database.disConnect()
        return res.send({error:error});
    }

})
routerPublicUsers.post("/verification",async(req,res)=>{
    let email = req.body.email;
    let password = req.body.password;
    let cipher = crypto.createCipher(algorithm, keyEncrypt);
    let passwordEncript = cipher.update(password, 'utf8', 'hex') + cipher.final('hex');

    database.connect()

    try{
        const user= await database.query("SELECT * FROM user where email= ? and password= ?", [email, passwordEncript])
        if(user.length>=1 ){

 
            let apiKey = jwt.sign(
                { 
                    email: email,
                    userId: user[0].id
                },
                "secret");

            objectOfApiKey.push(apiKey)
            database.disConnect()
            return res.send(
            {
                apiKey: apiKey,
                email: user[0].email,
            })
        }else if(user.length==0){
            database.disConnect()
            return res.send(
            {
                message:"Incorrect password or email"
            })
        }
    }catch(error){
        database.disConnect()
        return res.send({error:error});
    }
})

routerPublicUsers.post("/",async(req,res)=>{

    let email = req.body.email
    let password = req.body.password
    let cipher = crypto.createCipher(algorithm, keyEncrypt);
    let passwordEncript = cipher.update(password, 'utf8', 'hex') + cipher.final('hex');
    
    database.connect()

    try{

        await database.query("INSERT INTO user (password, email ) VALUES  (?, ?)", [ passwordEncript,email])

        const user= await database.query("SELECT * FROM user where email=? and password=?", [email, passwordEncript])   
        if(user.length>=1){

            let apiKey = jwt.sign(
                { 
                    email: email,
                    userId: user[0].id

                },
                "secret");

            objectOfApiKey.push(apiKey)
            database.disConnect()
            return res.send(
            {
                apiKey: apiKey,
                userId: user[0].id,
            })
                
        }  
    }catch(error){
        database.disConnect()
        return res.send({error:error})
    }
})
module.exports=routerPublicUsers
