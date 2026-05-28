// backend/routes/billing.js
const express = require('express');
const router  = express.Router();
const pool    = require('../db/pool');

// GET /api/billing
router.get('/', async (req, res, next) => {
  try {
    const { payment_status, payment_method, limit = 50, offset = 0 } = req.query;
    let query = `
      SELECT b.*,
             p.first_name || ' ' || p.last_name AS patient_name,
             t.treatment_type,
             t.description
      FROM billing b
      JOIN patients   p ON p.patient_id   = b.patient_id
      JOIN treatments t ON t.treatment_id = b.treatment_id
    `;
    const params = [];
    const where  = [];
    if (payment_status) { params.push(payment_status); where.push(`b.payment_status = $${params.length}`); }
    if (payment_method) { params.push(payment_method); where.push(`b.payment_method = $${params.length}`); }
    if (where.length) query += ' WHERE ' + where.join(' AND ');
    query += ` ORDER BY b.bill_date DESC
               LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) { next(err); }
});

// GET /api/billing/:id
router.get('/:id', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT b.*,
              p.first_name || ' ' || p.last_name AS patient_name,
              t.treatment_type, t.description
       FROM billing b
       JOIN patients   p ON p.patient_id   = b.patient_id
       JOIN treatments t ON t.treatment_id = b.treatment_id
       WHERE b.bill_id = $1`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Bill not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
});

// POST /api/billing
router.post('/', async (req, res, next) => {
  try {
    const { bill_id, patient_id, treatment_id,
            bill_date, amount, payment_method, payment_status } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO billing VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [bill_id, patient_id, treatment_id,
       bill_date, amount, payment_method, payment_status]
    );
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
});

// PUT /api/billing/:id  (typically to update payment status)
router.put('/:id', async (req, res, next) => {
  try {
    const { patient_id, treatment_id, bill_date,
            amount, payment_method, payment_status } = req.body;
    const { rows } = await pool.query(
      `UPDATE billing SET
         patient_id=$1, treatment_id=$2, bill_date=$3,
         amount=$4, payment_method=$5, payment_status=$6
       WHERE bill_id=$7 RETURNING *`,
      [patient_id, treatment_id, bill_date,
       amount, payment_method, payment_status, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Bill not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
});

// DELETE /api/billing/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const { rowCount } = await pool.query(
      'DELETE FROM billing WHERE bill_id = $1', [req.params.id]
    );
    if (!rowCount) return res.status(404).json({ error: 'Bill not found' });
    res.json({ message: 'Bill deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
