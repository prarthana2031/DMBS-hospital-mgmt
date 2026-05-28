// backend/routes/dashboard.js
const express = require('express');
const router  = express.Router();
const pool    = require('../db/pool');

// GET /api/dashboard/stats  – KPI summary cards
router.get('/stats', async (req, res, next) => {
  try {
    const [patients, doctors, appointments, billing] = await Promise.all([
      pool.query('SELECT COUNT(*)::int AS total FROM patients'),
      pool.query('SELECT COUNT(*)::int AS total FROM doctors'),
      pool.query(`
        SELECT
          COUNT(*)::int                                                   AS total,
          COUNT(*) FILTER (WHERE status = 'Scheduled')::int              AS scheduled,
          COUNT(*) FILTER (WHERE status = 'Completed')::int              AS completed,
          COUNT(*) FILTER (WHERE status = 'Cancelled')::int              AS cancelled,
          COUNT(*) FILTER (WHERE status = 'No-show')::int                AS no_show
        FROM appointments`),
      pool.query(`
        SELECT
          ROUND(SUM(amount)::numeric, 2)                                  AS total_revenue,
          ROUND(SUM(amount) FILTER (WHERE payment_status='Paid')::numeric, 2) AS paid,
          ROUND(SUM(amount) FILTER (WHERE payment_status='Pending')::numeric, 2) AS pending,
          ROUND(SUM(amount) FILTER (WHERE payment_status='Failed')::numeric, 2)  AS failed
        FROM billing`),
    ]);

    res.json({
      patients:     patients.rows[0],
      doctors:      doctors.rows[0],
      appointments: appointments.rows[0],
      billing:      billing.rows[0],
    });
  } catch (err) { next(err); }
});

// GET /api/dashboard/appointments-by-month
router.get('/appointments-by-month', async (req, res, next) => {
  try {
    const { rows } = await pool.query(`
      SELECT TO_CHAR(appointment_date, 'Mon') AS month,
             EXTRACT(MONTH FROM appointment_date)::int AS month_num,
             COUNT(*)::int AS total,
             COUNT(*) FILTER (WHERE status='Completed')::int  AS completed,
             COUNT(*) FILTER (WHERE status='Cancelled')::int  AS cancelled,
             COUNT(*) FILTER (WHERE status='No-show')::int    AS no_show
      FROM appointments
      GROUP BY month, month_num
      ORDER BY month_num`);
    res.json(rows);
  } catch (err) { next(err); }
});

// GET /api/dashboard/revenue-by-month
router.get('/revenue-by-month', async (req, res, next) => {
  try {
    const { rows } = await pool.query(`
      SELECT TO_CHAR(bill_date, 'Mon') AS month,
             EXTRACT(MONTH FROM bill_date)::int AS month_num,
             ROUND(SUM(amount)::numeric, 2) AS total,
             ROUND(SUM(amount) FILTER (WHERE payment_status='Paid')::numeric, 2)    AS paid,
             ROUND(SUM(amount) FILTER (WHERE payment_status='Pending')::numeric, 2) AS pending
      FROM billing
      GROUP BY month, month_num
      ORDER BY month_num`);
    res.json(rows);
  } catch (err) { next(err); }
});

// GET /api/dashboard/treatment-types
router.get('/treatment-types', async (req, res, next) => {
  try {
    const { rows } = await pool.query(`
      SELECT treatment_type,
             COUNT(*)::int                        AS count,
             ROUND(AVG(cost)::numeric, 2)         AS avg_cost,
             ROUND(SUM(cost)::numeric, 2)         AS total_cost
      FROM treatments
      GROUP BY treatment_type
      ORDER BY count DESC`);
    res.json(rows);
  } catch (err) { next(err); }
});

// GET /api/dashboard/top-doctors
router.get('/top-doctors', async (req, res, next) => {
  try {
    const { rows } = await pool.query(`
      SELECT d.doctor_id,
             d.first_name || ' ' || d.last_name AS name,
             d.specialization,
             d.hospital_branch,
             COUNT(a.appointment_id)::int        AS total_appointments,
             COUNT(a.appointment_id) FILTER (WHERE a.status='Completed')::int AS completed
      FROM doctors d
      LEFT JOIN appointments a ON a.doctor_id = d.doctor_id
      GROUP BY d.doctor_id
      ORDER BY total_appointments DESC
      LIMIT 10`);
    res.json(rows);
  } catch (err) { next(err); }
});

// GET /api/dashboard/insurance-breakdown
router.get('/insurance-breakdown', async (req, res, next) => {
  try {
    const { rows } = await pool.query(`
      SELECT insurance_provider,
             COUNT(*)::int AS patient_count
      FROM patients
      GROUP BY insurance_provider
      ORDER BY patient_count DESC`);
    res.json(rows);
  } catch (err) { next(err); }
});

module.exports = router;
