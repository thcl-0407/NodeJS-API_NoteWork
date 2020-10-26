const mssql = require('../config/mssql_conf.js')
const bcrypt = require('bcrypt')
 
async function GetUserbyId(Id, CallBack){
    await mssql.poolConnection
    try{
        const request = mssql.pool.request()
        const result = await request
        .input('user_id', mssql.mssql.Int, Id)
        .query('SELECT * FROM [NOTE_WORK].[dbo].[User] WHERE user_id = @user_id')
        if(result){
            CallBack(result.recordset)
        }else{
            CallBack(false)
        }
    }catch{
        CallBack(false)
    }
}

async function AddUser(User, CallBack){
    await mssql.poolConnection
    try{
        const request = mssql.pool.request()
        const result = await request
        .input('first_name', mssql.mssql.NVarChar, User.firstName)
        .input('last_name', mssql.mssql.NVarChar, User.lastName)
        .input('password', mssql.mssql.VarChar, bcrypt.hashSync(User.password, bcrypt.genSaltSync(10)))
        .query('INSERT INTO [NOTE_WORK].[dbo].[User](first_name, last_name, password) VALUES (@first_name, @last_name, @password)')
        if(result.rowsAffected[0] == 1){
            CallBack(true)
        }else{
            CallBack(false)
        }
    }catch{
        CallBack(false)
    }
}

async function Login(User, CallBack){
    await mssql.poolConnection
    try{
        const request = mssql.pool.request()
        const result = await request
        .input('first_name', mssql.mssql.NVarChar, User.firstName)
        .input('last_name', mssql.mssql.NVarChar, User.lastName)
        .input('password', mssql.mssql.VarChar, bcrypt.hashSync(User.password, bcrypt.genSaltSync(10)))
        .query('INSERT INTO [NOTE_WORK].[dbo].[User](first_name, last_name, password) VALUES (@first_name, @last_name, @password)')
        if(result.rowsAffected[0] == 1){
            CallBack(true)
        }else{
            CallBack(false)
        }
    }catch{
        CallBack(false)
    }
}

module.exports = {
    GetUserbyId,
    AddUser
}