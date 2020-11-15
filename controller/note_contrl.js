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

async function GetUserbyEmail(Email, CallBack){
    await mssql.poolConnection
    try{
        const request = mssql.pool.request()
        const result = await request
        .input('email', mssql.mssql.VarChar, Email)
        .query('SELECT * FROM [NOTE_WORK].[dbo].[User] WHERE email = @email')
        if(result.rowsAffected[0] > 0){
            CallBack(true, result.recordset)
        }else{
            CallBack(false, null)
        }
    }catch{
        CallBack(false, null)
    }
}

async function AddUser(User, CallBack){
    await GetUserbyEmail(User.email, async (result, data)=>{
        if(result == false){
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
        }else{
            CallBack(false)
        }
    })
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

async function UpdatePassword(User, CallBack){
    await GetUserbyEmail(User.email, async (result, data)=>{
        if(result == true){
            await mssql.poolConnection
            try{
                const request = mssql.pool.request()
                const result = await request
                .input('email', mssql.mssql.VarChar, User.email)
                .input('password', mssql.mssql.VarChar, bcrypt.hashSync(User.password, bcrypt.genSaltSync(10)))
                .query('UPDATE [NOTE_WORK].[dbo].[User] SET password = @password WHERE email = @email')
                if(result.rowsAffected[0] == 1){
                    CallBack(true)
                }else{
                    CallBack(false)
                }
            }catch{
                CallBack(false)
            }
        }else{
            CallBack(false)
        }
    })
}

async function UpdateUser(User, CallBack){
    await GetUserbyEmail(User.email, async (result, data)=>{
        if(result == true){
            await mssql.poolConnection
            try{
                const request = mssql.pool.request()
                const result = await request
                .input('first_name', mssql.mssql.NVarChar, User.firstName)
                .input('last_name', mssql.mssql.NVarChar, User.lastName)
                .input('email', mssql.mssql.VarChar, User.email)
                .query('UPDATE [NOTE_WORK].[dbo].[User] SET first_name = @first_name, last_name = @last_name WHERE email = @email')
                if(result.rowsAffected[0] == 1){
                    CallBack(true)
                }else{
                    CallBack(false)
                }
            }catch{
                CallBack(false)
            }
        }else{
            CallBack(false)
        }
    })
}

async function AddNote(Note, CallBack){
    await mssql.poolConnection
    try{
        const request = mssql.pool.request()
        const result = await request
        .input('title', mssql.mssql.NVarChar, Note.title)
        .input('content_note', mssql.mssql.NVarChar, Note.content_note)
        .input('user_id', mssql.mssql.VarChar, Note.user_id)
        .query('INSERT INTO [NOTE_WORK].[dbo].[Notes](title, content_note, user_id) VALUES (@title, @content_note, @user_id)')
        if(result.rowsAffected[0] == 1){
           CallBack(true)
        }else{
            CallBack(false)
        }
    }catch{
        CallBack(false)
    }
}

async function GetNoteByUserId(id, CallBack){
    await mssql.poolConnection
    try{
        const request = mssql.pool.request()
        const result = await request
        .input('user_id', mssql.mssql.VarChar, id)
        .query('SELECT * FROM [NOTE_WORK].[dbo].[Notes] WHERE user_id = @user_id')
        if(result.rowsAffected[0] > 0){
            CallBack(true, result.recordset)
        }else{
            CallBack(false, null)
        }
    }catch{
        CallBack(false, null)
    }
}

async function GetNoteByTitle(key, CallBack){
    await mssql.poolConnection
    try{
        const request = mssql.pool.request()
        const result = await request
        .input('title', mssql.mssql.VarChar, ("%" + key + "%"))
        .query('SELECT * FROM [NOTE_WORK].[dbo].[Notes] WHERE title LIKE @title')
        if(result.rowsAffected[0] > 0){
            CallBack(true, result.recordset)
        }else{
            CallBack(false, null)
        }
    }catch{
        CallBack(false, null)
    }
}

module.exports = {
    GetUserbyId,
    AddUser,
    Login,
    GetUserbyEmail,
    UpdatePassword, 
    UpdateUser,
    AddNote,
    GetNoteByUserId,
    GetNoteByTitle
}