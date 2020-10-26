const PORT_RUNNING = 1910
const express = require('express')
const route = require('./routes/route_note.js')
const app = express()

app.use('/api', route.GetUserbyId)

app.listen(PORT_RUNNING, ()=>{
    console.log('Running on PORT: ' + PORT_RUNNING)
})