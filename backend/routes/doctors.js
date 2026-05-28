// backend/routes/doctors.js
const express = require('express');
const router  = express.Router();
const pool    = require('../db/pool');

// GET /api/doctors
router.get('/', async (req, res, next) => {
  try {
    const { specialization, branch } = req.query;
    let query = `
      SELECT d.*,
             COUNT(a.appointment_id)::int AS total_appointments
      FROM doctors d
      LEFT JOIN appointments a ON a.doctor_id = d.doctor_id
    `;
    const params = [];
    const where  = [];
    if (specialization) { params.push(specialization); where.push(`d.specialization = $${params.length}`); }
    if (branch)         { params.push(branch);         where.push(`d.hospital_branch = $${params.length}`); }
    if (where.length)   query += ' WHERE ' + where.join(' AND ');
    query += ' GROUP BY d.doctor_id ORDER BY d.last_name, d.first_name';

    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) { next(err); }
});

// GET /api/doctors/:id
router.get('/:id', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM doctors WHERE doctor_id = $1', [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Doctor not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
});

// POST /api/doctors
router.post('/', async (req, res, next) => {
  try {
    const { doctor_id, first_name, last_name, specialization,
            phone_number, years_experience, hospital_branch, email } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO doctors VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [doctor_id, first_name, last_name, specialization,
       phone_number, years_experience, hospital_branch, email]
    );
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
});

// PUT /api/doctors/:id
router.put('/:id', async (req, res, next) => {
  try {
    const { first_name, last_name, specialization,
            phone_number, years_experience, hospital_branch, email } = req.body;
    const { rows } = await pool.query(
      `UPDATE doctors SET
         first_name=$1, last_name=$2, specialization=$3,
         phone_number=$4, years_experience=$5, hospital_branch=$6, email=$7
       WHERE doctor_id=$8 RETURNING *`,
      [first_name, last_name, specialization,
       phone_number, years_experience, hospital_branch, email, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Doctor not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
});

// DELETE /api/doctors/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const { rowCount } = await pool.query(
      'DELETE FROM doctors WHERE doctor_id = $1', [req.params.id]
    );
    if (!rowCount) return res.status(404).json({ error: 'Doctor not found' });
    res.json({ message: 'Doctor deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
