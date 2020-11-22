const PORT_RUNNING = 3000
const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const cors = require('cors')
const route = require('./routes/route_note.js')
const note_ctrl = require('./controller/note_contrl.js')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(session(
    {
        name: 'session_login',
        secret: 'cookie_secret',
        resave: false,
        saveUninitialized: false,
    }
))

app.set("view engine", "ejs")
app.set("views", "./views")


//Đăng Nhập
app.get("/login", (req, res)=>{
    req.session.destroy()
    res.render("login")
})

app.post("/login", (req, res)=>{
    let User = {
        email: req.body.email,
        password: req.body.password
    }

    note_ctrl.Login(User, (result, data)=>{
        if(result){
            req.session.UserEmail = data.email
            req.session.UserID = data.user_id

            res.redirect("/")
        }else{
            res.redirect("login")
        }
    })
})

//Loading Note Page
app.get("/", (req, res)=>{
    if(req.session.UserEmail){
        note_ctrl.GetNoteByUserId(req.session.UserID, (result, data)=>{
            res.render('note', {
                Notes: data,
                UserEmail: req.session.UserEmail,
                UserID: req.session.UserID
            })
        })
    }else{
        res.redirect('/login')
    }
})

//Đăng Xuất
app.get("/logout", (req, res)=>{
    req.session.destroy()
    res.redirect("/")
})

//API
app.use('/api', route.GetUserbyId)

io.sockets.on('connection',  (socket)=>{

    socket.on('InitTaskNote', (InforConnect)=>{
        socket.join(InforConnect.UserEmail)
        socket.UserEmail = InforConnect.UserEmail
        socket.IntentCode = InforConnect.IntentCode;

        console.log("Người Mới Kết Nối: " + socket.UserEmail)
    })

    //Lắng Nghe Người Dùng Đang Tạo Ghi Chú
    socket.on('ClientDangTaoMoiGhiChu', (InforConnect)=>{
        console.log("Đang Tạo Mới Ghi Chú: " + InforConnect.UserEmail + " " + InforConnect.Device)

        socket.on('UserTypingCreateTitle', (TypingParrams)=>{
            console.log("Cập Nhật Tiêu Đề Mới: " + InforConnect.UserEmail + " " +TypingParrams.Device)

            socket.broadcast.to(InforConnect.UserEmail).emit("CapNhatTypingTitle", {
                Device: InforConnect.Device,
                Title: TypingParrams.TitleContent
            })
        })
    
        socket.on('UserTypingCreateContentNote', (TypingParrams)=>{
            console.log("Cập Nhật Nội Dung Mới: " + InforConnect.UserEmail)

            socket.broadcast.to(InforConnect.UserEmail).emit("CapNhatTypingContentNote", {
                Device: InforConnect.Device,
                Content: TypingParrams.ContentNote
            })
        })
    })

    //Lắng Nghe Người Dùng Huỷ Ghi Chú
    socket.on("ClientHuyGhiChu", (InforConnect)=>{
        console.log("Huỷ Ghi Chú: " + InforConnect.UserEmail)

        if(InforConnect.IntentCode == 999){
            socket.broadcast.to(InforConnect.UserEmail).emit("CapNhatHuyGhiChu", InforConnect)
        }
    })

    socket.on('ThemMoiGhiChuClient', (InforConnect)=>{
        console.log("Thêm Ghi Chú: " + InforConnect.UserEmail)
        socket.broadcast.to(InforConnect.UserEmail).emit('CapNhatDanhSachGhiChuThem', InforConnect)
    })

    socket.on('XoaGhiChuClient', (InforConnect)=>{
        console.log("Xoá Ghi Chú: " + InforConnect.UserEmail)
        socket.broadcast.to(InforConnect.UserEmail).emit('CapNhatDanhSachGhiChuXoa', InforConnect)
    })
})

server.listen(PORT_RUNNING, ()=>{
    console.log('Running on PORT: ' + PORT_RUNNING)
})
