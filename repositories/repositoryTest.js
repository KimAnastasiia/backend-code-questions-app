const database = require("../database")
const fs = require('fs');
const path = require('path');
repositoryTest = {
    insertTests: async (email, name) => {
        let results = null

        try {
            database.connect();
            results = await database.query("INSERT INTO tests (email, name ) VALUES  ( ?, ?) ", [email, name])
            database.disConnect()
        } catch (error) {
            database.disConnect()
            console.log(error)
        }
        return results.insertId
    },
    getTests: async (email) => {
        let results = null

        try {
            database.connect();
            results = await database.query("SELECT * from tests WHERE email=?", [email])
            database.disConnect()
        } catch (error) {
            database.disConnect()
            console.log(error)
        }
        return results
    },
    getTest: async (email, id) => {
        let results = null

        try {
            database.connect();
            results = await database.query("SELECT * from tests WHERE email=? and id=?", [email, id])
            database.disConnect()
        } catch (error) {
            database.disConnect()
            console.log(error)
        }
        return results
    },
    insertTest: async (name, email) => {
        let result = null

        try {
            database.connect();
            result = await database.query("INSERT INTO tests (email, name ) VALUES  ( ?, ?) ", [email, name])
            database.disConnect();
        } catch (error) {
            database.disConnect();
        }
        return result
    },
    updateTest: async (newName, email, id) => {
        let result = null
        try {
            database.connect();
            result = await database.query("UPDATE tests SET  name=? where email=? and id=? ",
                [newName, email, id])
            database.disConnect()
        } catch (error) {
            database.disConnect()
        }
        return result
    },
    deleteTest: async (testId) => {

        let result = null
        try {
            database.connect();
            result = await database.query("DELETE FROM tests WHERE id=?", [testId])
            database.disConnect();
        } catch (error) {
            database.disConnect();
        }
        return result
    }
}
module.exports = repositoryTest