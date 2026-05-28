# 🏥 MediCore – Hospital Management System

A full-stack DBMS project built with **React + Node.js/Express + PostgreSQL**.

---

## Project Structure

```
hospital-mgmt/
├── backend/
│   ├── db/
│   │   ├── pool.js          # pg connection pool
│   │   ├── schema.sql       # table definitions + indexes
│   │   └── seed.sql         # all 200+ records from CSVs
│   ├── routes/
│   │   ├── patients.js      # CRUD /api/patients
│   │   ├── doctors.js       # CRUD /api/doctors
│   │   ├── appointments.js  # CRUD /api/appointments
│   │   ├── treatments.js    # CRUD /api/treatments
│   │   ├── billing.js       # CRUD /api/billing
│   │   └── dashboard.js     # Analytics /api/dashboard/*
│   ├── server.js            # Express entry point
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── api/index.js     # Centralised fetch helpers
    │   ├── pages/
    │   │   ├── Dashboard.js     # KPI cards + charts
    │   │   ├── Patients.js      # Table + CRUD modal
    │   │   ├── Doctors.js       # Table + CRUD modal
    │   │   ├── Appointments.js  # Table + CRUD modal
    │   │   ├── Treatments.js    # Table + CRUD modal
    │   │   └── Billing.js       # Table + CRUD modal
    │   ├── App.js           # Router + sidebar layout
    │   ├── index.css        # All global styles
    │   └── index.js
    └── package.json
```

---

## Database Schema (PostgreSQL)

```
doctors      ←─┐
patients     ←─┼── appointments ←── treatments ←── billing
               └──────────────────────────────────────────┘
```

### Tables
| Table        | Primary Key      | Foreign Keys                          |
|-------------|-----------------|---------------------------------------|
| doctors      | doctor_id        | —                                     |
| patients     | patient_id       | —                                     |
| appointments | appointment_id   | patient_id → patients, doctor_id → doctors |
| treatments   | treatment_id     | appointment_id → appointments         |
| billing      | bill_id          | patient_id → patients, treatment_id → treatments |

---

## API Endpoints

### Dashboard (Analytics)
| Method | Endpoint                              | Description              |
|--------|---------------------------------------|--------------------------|
| GET    | /api/dashboard/stats                  | KPI summary              |
| GET    | /api/dashboard/appointments-by-month  | Monthly appointment data |
| GET    | /api/dashboard/revenue-by-month       | Monthly revenue data     |
| GET    | /api/dashboard/treatment-types        | Treatment breakdown      |
| GET    | /api/dashboard/top-doctors            | Top 10 doctors           |
| GET    | /api/dashboard/insurance-breakdown    | Insurance distribution   |

### CRUD Resources (each supports GET list, GET by ID, POST, PUT, DELETE)
- `/api/patients`
- `/api/doctors`
- `/api/appointments`
- `/api/treatments`
- `/api/billing`

### Query Parameters (GET list endpoints)
- **patients**: `?search=<name|email|id>&limit=50&offset=0`
- **doctors**: `?specialization=<spec>&branch=<branch>`
- **appointments**: `?status=<status>&doctor_id=<id>&patient_id=<id>&date_from=<date>&date_to=<date>`
- **treatments**: `?treatment_type=<type>`
- **billing**: `?payment_status=<status>&payment_method=<method>`

---

## Setup & Running

### 1. PostgreSQL Setup

```bash
# Create the database
psql -U postgres -c "CREATE DATABASE hospital_db;"

# Load schema
psql -U postgres -d hospital_db -f backend/db/schema.sql

# Seed all data
psql -U postgres -d hospital_db -f backend/db/seed.sql
```

### 2. Backend

```bash
cd backend
cp .env.example .env          # fill in your DB credentials
npm install
npm run dev                   # runs on http://localhost:5000
```

### 3. Frontend

```bash
cd frontend
npm install
npm start                     # runs on http://localhost:3000
```

---

## Features

- **Dashboard**: Live KPI cards, bar/line/pie charts for appointments, revenue, treatments, insurance
- **Patients**: Search, filter, full CRUD with modal forms
- **Doctors**: Filter by specialization & branch, full CRUD
- **Appointments**: Filter by status, visual status badges, full CRUD
- **Treatments**: Filter by type, cost summaries per treatment type, full CRUD
- **Billing**: Filter by status & payment method, financial summaries, full CRUD

---

## Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Database | PostgreSQL 14+                    |
| Backend  | Node.js, Express 4, pg (node-postgres) |
| Frontend | React 18, React Router 6, Recharts |
| Styling  | Custom CSS (no framework)         |
