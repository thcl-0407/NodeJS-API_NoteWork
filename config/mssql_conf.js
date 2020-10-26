const mssql = require('mssql')

const pool = new mssql.ConnectionPool({
    user: 'admin',
    password: 'sapassword',
    server: 'aws-sql-server-db.c7i6un41glyu.ap-southeast-1.rds.amazonaws.com',
    database: 'NOTE_WORK',
})

const poolConnection = pool.connect()

pool.on('error', (err)=>{
    console.log(err)
})

module.exports = {
    mssql, poolConnection, pool
}

