const express = require('express')
const bodyParser  = require('body-parser')
const noteController = require('../controller/note_contrl.js')
const route = express.Router()
route.use(bodyParser.json())

module.exports = {
    GetUserbyId: route.get('/id=:id', (req, res)=>{
        noteController.GetUserbyId(req.params.id, (data)=>{
            if(data == false){
                res.send({
                    success: 0,
                    users: []
                })
            }else{
                res.send({
                    success: 1,
                    users: data
                })
            }
        })
    })
}