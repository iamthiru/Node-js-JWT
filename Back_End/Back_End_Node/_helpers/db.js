const mysql = require("mysql");

const dbConfig = {
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    password: "rootroot",
    database: "impact_dev",
};

const pool = mysql.createPool(dbConfig);

console.log("dbConfig", dbConfig);
// console.log("env",process.env);

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.')
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.')
        }
        console.log("", err);
    }
    if (connection) connection.release();
    return
});

module.exports = pool;
