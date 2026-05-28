// backend/routes/treatments.js
const express = require('express');
const router  = express.Router();
const pool    = require('../db/pool');

// GET /api/treatments
router.get('/', async (req, res, next) => {
  try {
    const { treatment_type, limit = 50, offset = 0 } = req.query;
    let query = `
      SELECT t.*,
             p.first_name || ' ' || p.last_name AS patient_name,
             d.first_name || ' ' || d.last_name AS doctor_name,
             a.reason_for_visit
      FROM treatments t
      JOIN appointments a ON a.appointment_id = t.appointment_id
      JOIN patients     p ON p.patient_id      = a.patient_id
      JOIN doctors      d ON d.doctor_id       = a.doctor_id
    `;
    const params = [];
    if (treatment_type) {
      params.push(treatment_type);
      query += ` WHERE t.treatment_type = $1`;
    }
    query += ` ORDER BY t.treatment_date DESC
               LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) { next(err); }
});

// GET /api/treatments/:id
router.get('/:id', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT t.*,
              p.first_name || ' ' || p.last_name AS patient_name,
              d.first_name || ' ' || d.last_name AS doctor_name
       FROM treatments t
       JOIN appointments a ON a.appointment_id = t.appointment_id
       JOIN patients     p ON p.patient_id      = a.patient_id
       JOIN doctors      d ON d.doctor_id       = a.doctor_id
       WHERE t.treatment_id = $1`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Treatment not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
});

// POST /api/treatments
router.post('/', async (req, res, next) => {
  try {
    const { treatment_id, appointment_id, treatment_type,
            description, cost, treatment_date } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO treatments VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [treatment_id, appointment_id, treatment_type, description, cost, treatment_date]
    );
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
});

// PUT /api/treatments/:id
router.put('/:id', async (req, res, next) => {
  try {
    const { appointment_id, treatment_type, description, cost, treatment_date } = req.body;
    const { rows } = await pool.query(
      `UPDATE treatments SET
         appointment_id=$1, treatment_type=$2, description=$3, cost=$4, treatment_date=$5
       WHERE treatment_id=$6 RETURNING *`,
      [appointment_id, treatment_type, description, cost, treatment_date, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Treatment not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
});

// DELETE /api/treatments/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const { rowCount } = await pool.query(
      'DELETE FROM treatments WHERE treatment_id = $1', [req.params.id]
    );
    if (!rowCount) return res.status(404).json({ error: 'Treatment not found' });
    res.json({ message: 'Treatment deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
