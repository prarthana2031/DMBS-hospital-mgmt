// backend/server.js
require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const patientsRouter     = require('./routes/patients');
const doctorsRouter      = require('./routes/doctors');
const appointmentsRouter = require('./routes/appointments');
const treatmentsRouter   = require('./routes/treatments');
const billingRouter      = require('./routes/billing');
const dashboardRouter    = require('./routes/dashboard');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Routes ──────────────────────────────────────────────────
app.use('/api/patients',     patientsRouter);
app.use('/api/doctors',      doctorsRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/treatments',   treatmentsRouter);
app.use('/api/billing',      billingRouter);
app.use('/api/dashboard',    dashboardRouter);

// ── Health check ────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// ── Global error handler ────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () =>
  console.log(`🏥  Hospital API running on http://localhost:${PORT}`)
);
