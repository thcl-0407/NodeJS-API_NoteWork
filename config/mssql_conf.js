const mssql = require('mssql')
const poolConnection = mssql.poolConnection
const pool = mssql.pool

const config = {
    user: 'admin',
    password: 'sapassword',
    server: 'aws-sql-server-db.c7i6un41glyu.ap-southeast-1.rds.amazonaws.com',
    database: 'NOTE_WORK',
}



module.exports = {
    mssql, poolConnection, pool
}

