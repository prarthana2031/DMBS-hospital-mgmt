// backend/routes/patients.js
const express = require('express');
const router  = express.Router();
const pool    = require('../db/pool');

// GET /api/patients  – list with optional search
router.get('/', async (req, res, next) => {
  try {
    const { search, limit = 50, offset = 0 } = req.query;
    let query = `
      SELECT p.*,
             COUNT(a.appointment_id)::int AS total_appointments
      FROM patients p
      LEFT JOIN appointments a ON a.patient_id = p.patient_id
    `;
    const params = [];
    if (search) {
      params.push(`%${search}%`);
      query += ` WHERE p.first_name ILIKE $1
                    OR p.last_name  ILIKE $1
                    OR p.email      ILIKE $1
                    OR p.patient_id ILIKE $1`;
    }
    query += ` GROUP BY p.patient_id ORDER BY COALESCE(p.registration_date, '1970-01-01') DESC, p.patient_id
           LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) { next(err); }
});

// GET /api/patients/:id
router.get('/:id', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM patients WHERE patient_id = $1', [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Patient not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
});

// POST /api/patients
router.post('/', async (req, res, next) => {
  try {
    const {
      patient_id, first_name, last_name, gender, date_of_birth,
      contact_number, address, registration_date,
      insurance_provider, insurance_number, email
    } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO patients VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING *`,
      [patient_id, first_name, last_name, gender, date_of_birth,
       contact_number, address, registration_date,
       insurance_provider, insurance_number, email]
    );
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
});

// PUT /api/patients/:id
router.put('/:id', async (req, res, next) => {
  try {
    const {
      first_name, last_name, gender, date_of_birth, contact_number,
      address, registration_date, insurance_provider, insurance_number, email
    } = req.body;
    const { rows } = await pool.query(
      `UPDATE patients SET
         first_name=$1, last_name=$2, gender=$3, date_of_birth=$4,
         contact_number=$5, address=$6, registration_date=$7,
         insurance_provider=$8, insurance_number=$9, email=$10
       WHERE patient_id=$11 RETURNING *`,
      [first_name, last_name, gender, date_of_birth, contact_number,
       address, registration_date, insurance_provider, insurance_number,
       email, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Patient not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
});

// DELETE /api/patients/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const { rowCount } = await pool.query(
      'DELETE FROM patients WHERE patient_id = $1', [req.params.id]
    );
    if (!rowCount) return res.status(404).json({ error: 'Patient not found' });
    res.json({ message: 'Patient deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
