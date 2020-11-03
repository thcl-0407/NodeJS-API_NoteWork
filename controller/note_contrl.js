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
        .input('email', mssql.mssql.VarChar, User.email)
        .input('password', mssql.mssql.VarChar, bcrypt.hashSync(User.password, bcrypt.genSaltSync(10)))
        .query('INSERT INTO [NOTE_WORK].[dbo].[User](first_name, last_name, email, password) VALUES (@first_name, @last_name, @email, @password)')
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
        .input('email', mssql.mssql.VarChar, User.email)
        .query('SELECT * FROM [NOTE_WORK].[dbo].[User] WHERE email = @email')
        if(result.rowsAffected[0] == 1){
            const isMatch = bcrypt.compareSync(User.password, result.recordset[0].password);

            if(isMatch){
                CallBack(true)
            }else{
                CallBack(false)
            }
        }else{
            CallBack(false)
        }
    }catch{
        CallBack(false)
    }
}

module.exports = {
    GetUserbyId,
    AddUser,
    Login
}