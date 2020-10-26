const express = require('express')
const bodyParser  = require('body-parser')
const noteController = require('../controller/note_contrl.js')
const route = express.Router()
route.use(bodyParser.json())

module.exports = {
    GetUserbyId: route.get('/id=:id', (req, res)=>{
        noteController.GetUserbyId(req.params.id, (data)=>{
            if(!data){
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
    }),

    AddUser: route.post('/add', (req,res)=>{
        let User = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: req.body.password
        }

        noteController.AddUser(User, (result)=>{
            if(!result){
                res.send({
                    success: 0,
                    message: "Có Lỗi Xảy Ra"
                })
            }else{
                res.send({
                    success: 1,
                    message: "Thêm Thành Công"
                })
            } 
        })
    })

    
}