// link to MariaDB
const { createPool } = require('mysql2/promise');
// create a connection pool
const connection = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

module.exports = {connection};