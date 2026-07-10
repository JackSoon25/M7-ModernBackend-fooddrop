const express = require('express');
const router = express.Router();
const { connection } = require('./db');

// vendor home route (aka CRUD - Read)
router.get('/', async function (req, res) {
    const sql = `SELECT * FROM vendors`;
    // Note: .execute doesn't support "nestTables".  Only .query support the "nestTables": ture
    const [vendors] = await connection.execute(sql);
    res.render('vendor/index', {
        vendors
    });
});

// vendor Create route (CRUD - C)
router.get('/create', async function (req, res) {
    const [cuisines] = await connection.execute(`SELECT * FROM cuisines`);
    res.render('vendor/create', { cuisines });
})

router.post('/create', async function (req, res) {
    try {
        const { vendor_name, mobile_number, pwd, unit_number, building_number, street_name, postal_code, cuisine_id } = req.body;
        const sql = `INSERT INTO vendors (vendor_name, mobile_number, pwd, unit_number, building_number, street_name, postal_code,created_at , updated_at, cuisine_id) VALUES (?, ?, ?, ?, ?, ?, ?, now(), now(), ?)`;
        await connection.execute(sql, [vendor_name, mobile_number, pwd, unit_number, building_number || "", street_name, postal_code, cuisine_id]);
        res.redirect('/vendor');
    } catch (error) {
        console.error('Error creating vendor:', error);
        res.status(500).send('Error creating vendor');
    }
});

// vendor Delete route (CRUD - D)
router.get('/:id/delete', async function (req, res) {
    const { id } = req.params;
    const sql = `SELECT * FROM vendors WHERE vendor_id = ?`;
    const [vendors] = await connection.execute(sql, [id]);
    res.render('vendor/delete', { vendor: vendors[0] });
});

router.post('/:id/delete', async function (req, res) {
    const { id } = req.params;
    const sql = `DELETE FROM vendors WHERE vendor_id = ?`;
    await connection.execute(sql, [id]);
    res.redirect('/vendor');
});

// vendor Update route (CRUD - U)
router.get('/:id/update', async function (req, res) {
    const { id } = req.params;
    const sql = `SELECT * FROM vendors WHERE vendor_id = ?`;
    const [vendors] = await connection.execute(sql, [id]);
    const [cuisines] = await connection.execute(`SELECT * FROM cuisines`);
    res.render('vendor/update', { vendor: vendors[0], cuisines });
});

router.post('/:id/update', async function (req, res) {

    const conn = await connection.getConnection();
    try {
        await conn.beginTransaction();
        const { vendor_name, mobile_number, pwd, unit_number, building_number, street_name, postal_code, cuisine_id  } = req.body;
        const vendor_id = req.params.id;

        const sql = `UPDATE vendors SET vendor_name = ?, mobile_number = ?, pwd = ?, unit_number = ?, building_number = ?, street_name = ?, postal_code = ?, cuisine_id = ?, updated_at = now() WHERE vendor_id = ?`;

        await conn.execute(sql, [vendor_name, mobile_number, pwd, unit_number, building_number, street_name, postal_code, cuisine_id, vendor_id]);

        await conn.commit();
    } catch (e) {
        await conn.rollback();
    } finally {
        await conn.release();
    }

    res.redirect('/vendor')
});

module.exports = { router };