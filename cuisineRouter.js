const express = require('express');
const router = express.Router();
const {connection} = require('./db');

// cuisine's home route (aka CRUD - Read)
router.get('/', async function(req, res) {
    const sql = `SELECT * FROM cuisines`;
    // Note: .execute doesn't support "nestTables".  Only .query support the "nestTables": ture
    const [cuisines] = await connection.execute(sql);
    res.render('cuisine/index', {
        cuisines});
});

// cuisine Create route (CRUD - C)
router.get('/create', async function (req, res) {
    res.render('cuisine/create');
})

router.post('/create', async function (req, res) {
    const {cuisine_name} = req.body;
    const sql = `INSERT INTO cuisines (cuisine_name) VALUES (?)`;
    await connection.execute(sql, [cuisine_name]);
    res.redirect('/cuisine');
});

// cuisine Delete route (CRUD - D)
router.get('/:id/delete', async function (req, res) {
    const {id} = req.params;
    const sql = `SELECT * FROM cuisines WHERE cuisine_id = ?`;
    const [cuisines] = await connection.execute(sql, [id]);
    res.render('cuisine/delete', { cuisine: cuisines[0] });
});

router.post('/:id/delete', async function (req, res) {
    const {id} = req.params;
    const sql = `DELETE FROM cuisines WHERE cuisine_id = ?`;
    await connection.execute(sql, [id]);
    res.redirect('/cuisine');
});



module.exports = {router};