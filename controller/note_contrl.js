const { pool } = require('../config/mssql_conf.js')
const mssql = require('../config/mssql_conf.js')
 
async function GetUserbyId(Id, CallBack){
    await mssql.poolConnection
    try{
        const request = mssql.pool.request()
        const result = await request
        .input('user_id', mssql.mssql.Int, Id)
        .query('SELECT * FROM User WHERE user_id = @user_id')
        console.log(result)
        if(result){
            CallBack(result)
        }else{
            CallBack(false)
        }
    }catch{
        CallBack(false)
    }
}

module.exports = {
    GetUserbyId
}