// backend/routes/appointments.js
const express = require('express');
const router  = express.Router();
const pool    = require('../db/pool');

// GET /api/appointments  – with joins for display
router.get('/', async (req, res, next) => {
  try {
    const { status, doctor_id, patient_id, date_from, date_to, limit = 50, offset = 0 } = req.query;
    let query = `
      SELECT a.*,
             p.first_name || ' ' || p.last_name AS patient_name,
             d.first_name || ' ' || d.last_name AS doctor_name,
             d.specialization
      FROM appointments a
      JOIN patients p ON p.patient_id = a.patient_id
      JOIN doctors  d ON d.doctor_id  = a.doctor_id
    `;
    const params = [];
    const where  = [];
    if (status)    { params.push(status);    where.push(`a.status = $${params.length}`); }
    if (doctor_id) { params.push(doctor_id); where.push(`a.doctor_id = $${params.length}`); }
    if (patient_id){ params.push(patient_id);where.push(`a.patient_id = $${params.length}`); }
    if (date_from) { params.push(date_from); where.push(`a.appointment_date >= $${params.length}`); }
    if (date_to)   { params.push(date_to);   where.push(`a.appointment_date <= $${params.length}`); }
    if (where.length) query += ' WHERE ' + where.join(' AND ');
    query += ` ORDER BY a.appointment_date DESC, a.appointment_time DESC
               LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) { next(err); }
});

// GET /api/appointments/:id
router.get('/:id', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT a.*,
              p.first_name || ' ' || p.last_name AS patient_name,
              d.first_name || ' ' || d.last_name AS doctor_name,
              d.specialization
       FROM appointments a
       JOIN patients p ON p.patient_id = a.patient_id
       JOIN doctors  d ON d.doctor_id  = a.doctor_id
       WHERE a.appointment_id = $1`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Appointment not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
});

// POST /api/appointments
router.post('/', async (req, res, next) => {
  try {
    const { appointment_id, patient_id, doctor_id,
            appointment_date, appointment_time, reason_for_visit, status } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO appointments VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [appointment_id, patient_id, doctor_id,
       appointment_date, appointment_time, reason_for_visit, status]
    );
    res.status(201).json(rows[0]);
  } catch (err) { next(err); }
});

// PUT /api/appointments/:id
router.put('/:id', async (req, res, next) => {
  try {
    const { patient_id, doctor_id, appointment_date,
            appointment_time, reason_for_visit, status } = req.body;
    const { rows } = await pool.query(
      `UPDATE appointments SET
         patient_id=$1, doctor_id=$2, appointment_date=$3,
         appointment_time=$4, reason_for_visit=$5, status=$6
       WHERE appointment_id=$7 RETURNING *`,
      [patient_id, doctor_id, appointment_date,
       appointment_time, reason_for_visit, status, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Appointment not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
});

// DELETE /api/appointments/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const { rowCount } = await pool.query(
      'DELETE FROM appointments WHERE appointment_id = $1', [req.params.id]
    );
    if (!rowCount) return res.status(404).json({ error: 'Appointment not found' });
    res.json({ message: 'Appointment deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
