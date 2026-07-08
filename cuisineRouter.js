const express = require('express');
const router = express.Router();
const {connection} = require('./db');

// cuisine's home route
router.get('/', async function(req, res) {
    const sql = `SELECT * FROM cuisines`;
    const [cuisines] = await connection.execute(sql);

    res.render('cuisine/index', {cuisines});
});




module.exports = {router};