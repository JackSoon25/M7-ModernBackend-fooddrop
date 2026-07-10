const express = require('express');
const router = express.Router();
const { connection } = require('./db');

// user home route (aka CRUD - Read)
router.get('/', async function (req, res) {
    const sql = `SELECT * FROM users`;
    // Note: .execute doesn't support "nestTables".  Only .query support the "nestTables": ture
    const [users] = await connection.execute(sql);
    res.render('user/index', {
        users
    });
});

// user Create route (CRUD - C)
router.get('/create', async function (req, res) {
    res.render('user/create');
})

router.post('/create', async function (req, res) {
    try {
        const { mobile_number, pwd} = req.body;
        const sql = `INSERT INTO users (mobile_number, pwd, created_at) VALUES (?, ?, NOW())`;
        await connection.execute(sql, [mobile_number, pwd]);
        res.redirect('/user');
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('Error creating user');
    }
});

// user Delete route (CRUD - D)
router.get('/:id/delete', async function (req, res) {
    const { id } = req.params;
    const sql = `SELECT * FROM users WHERE user_id = ?`;
    const [users] = await connection.execute(sql, [id]);
    res.render('user/delete', { user: users[0] });
});

router.post('/:id/delete', async function (req, res) {
    const { id } = req.params;
    const sql = `DELETE FROM users WHERE user_id = ?`;
    await connection.execute(sql, [id]);
    res.redirect('/user');
});

// user Update route (CRUD - U)
router.get('/:id/update', async function (req, res) {
    const { id } = req.params;
    const sql = `SELECT * FROM users WHERE user_id = ?`;
    const [users] = await connection.execute(sql, [id]);
    res.render('user/update', { user: users[0] });
});

router.post('/:id/update', async function (req, res) {

    const conn = await connection.getConnection();
    try {
        await conn.beginTransaction();
        const { mobile_number, pwd } = req.body;
        const user_id = req.params.id;

        const sql = `UPDATE users SET mobile_number = ? , pwd = ? WHERE user_id = ?`;

        await conn.execute(sql, [mobile_number, pwd, user_id]);

        await conn.commit();
    } catch (e) {
        await conn.rollback();
    } finally {
        await conn.release();
    }

    res.redirect('/user')
});

module.exports = { router };