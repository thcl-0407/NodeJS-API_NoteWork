const express = require('express')
const bodyParser  = require('body-parser')
const noteController = require('../controller/note_contrl.js')
const { Login } = require('../controller/note_contrl.js')
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
            firstName: req.body.first_name,
            lastName: req.body.last_name,
            email: req.body.email,
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
    }),

    Login: route.post('/login', (req,res)=>{
        let User = {
            email: req.body.email,
            password: req.body.password
        }

        noteController.Login(User, (result)=>{
            if(!result){
                res.send({
                    success: 0,
                    message: "Đăng Nhập Thất Bại"
                })
            }else{
                res.send({
                    success: 1,
                    message: "Đăng Nhập Thành Công"
                })
            } 
        })
    })
}