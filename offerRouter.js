const express = require('express');
const router = express.Router();
const { connection } = require('./db');

// offer home route (aka CRUD - Read)
router.get('/', async function (req, res) {
    const { offer_description, expiry_time, vendor_id } = req.query;
    const bindings=[];
    
    let sql = `SELECT * FROM offers
                JOIN vendors ON offers.vendor_id = vendors.vendor_id
                WHERE 1`;

    if (offer_description) {
        sql += ` AND offer_description LIKE ?`;
        bindings.push(`%${offer_description}%`);
    }
    if (expiry_time) {
        const normalizedExpiryTime = expiry_time.replace('T', ' ').replace('Z', '') + ':00';
        console.log("expiry_time", expiry_time);
        console.log("normalizedExpiryTime", normalizedExpiryTime);
        sql += ` AND expiry_time >= ?`;
        bindings.push(normalizedExpiryTime);
    }

    sql += ' ORDER BY offers.created_at DESC';

    // Note: .execute doesn't support "nestTables".  Only .query support the "nestTables": ture
    const [offers] = await connection.execute(sql, bindings);
    const [vendors] = await connection.execute(`SELECT * FROM vendors`);


    res.render('offer/index', {
        offers,
        searchParams: { offer_description, expiry_time, vendor_id },
        vendors
    });
});

// offer Create route (CRUD - C)
router.get('/create', async function (req, res) {
    const [vendors] = await connection.execute(`SELECT * FROM vendors`);
    res.render('offer/create', { vendors });
});

router.post('/create', async function (req, res) {
    try {
        const { offer_description, expiry_time, vendor_id } = req.body;
        const sql = `INSERT INTO offers (offer_description, expiry_time, created_at, vendor_id) VALUES (?, ?, NOW(), ?)`;
        await connection.execute(sql, [offer_description, expiry_time, vendor_id]);
        res.redirect('/offer');
    } catch (error) {
        console.error('Error creating offer:', error);
        res.status(500).send('Error creating offer');
    }
});

// offer Delete route (CRUD - D)
router.get('/:id/delete', async function (req, res) {
    const { id } = req.params;
    const sql = `SELECT * FROM offers WHERE offer_id = ?`;
    const [offers] = await connection.execute(sql, [id]);
    const [vendors] = await connection.execute(`SELECT * FROM vendors`);
    const vendor = vendors.find(v => v.vendor_id === offers[0].vendor_id);
    res.render('offer/delete', { offer: offers[0], vendor });
});

router.post('/:id/delete', async function (req, res) {
    const { id } = req.params;
    const sql = `DELETE FROM offers WHERE offer_id = ?`;
    await connection.execute(sql, [id]);
    res.redirect('/offer');
});

// offer Update route (CRUD - U)
router.get('/:id/update', async function (req, res) {
    const { id } = req.params;
    const sql = `SELECT * FROM offers WHERE offer_id = ?`;
    const [offers] = await connection.execute(sql, [id]);
    const [vendors] = await connection.execute(`SELECT * FROM vendors`);
    res.render('offer/update', { offer: offers[0], vendors });
});

router.post('/:id/update', async function (req, res) {

    const conn = await connection.getConnection();
    try {
        await conn.beginTransaction();
        const { offer_description, expiry_time, vendor_id } = req.body;
        const offer_id = req.params.id;

        const sql = `UPDATE offers SET offer_description = ?, expiry_time = ?, updated_at = NOW(), vendor_id = ? WHERE offer_id = ?`;

        await conn.execute(sql, [offer_description, expiry_time, vendor_id, offer_id]);

        await conn.commit();
    } catch (e) {
        await conn.rollback();
    } finally {
        await conn.release();
    }

    res.redirect('/offer')
});

module.exports = { router };