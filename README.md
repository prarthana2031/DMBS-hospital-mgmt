# 🏥 MediCore – Hospital Management System

A full-stack DBMS project built with **React + Node.js/Express + PostgreSQL**.

---

## Project Structure

```text
hospital-mgmt/
├── backend/
│   ├── db/
│   │   ├── pool.js
│   │   ├── schema.sql
│   │   └── seed.sql
│   ├── routes/
│   │   ├── auth.js          # Staff authentication routes
│   │   ├── patients.js
│   │   ├── doctors.js
│   │   ├── appointments.js
│   │   ├── treatments.js
│   │   ├── billing.js
│   │   └── dashboard.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── public/
    │   ├── hero.png         # Landing page hero image
    │   └── index.html
    │
    ├── src/
    │   ├── api/
    │   │   └── index.js
    │   │
    │   ├── pages/
    │   │   ├── Home.js
    │   │   ├── Login.js
    │   │   ├── Dashboard.js
    │   │   ├── Patients.js
    │   │   ├── Doctors.js
    │   │   ├── DoctorsList.js
    │   │   ├── Appointments.js
    │   │   ├── BookAppointment.js
    │   │   ├── Treatments.js
    │   │   └── Billing.js
    │   │
    │   ├── App.js
    │   ├── index.css
    │   └── index.js
    │
    └── package.json
```

---

## Public Website Features

### Home Page

The application includes a modern healthcare landing page featuring:

* Hero section with hospital management overview
* Healthcare statistics cards
* Feature highlights
* Why Choose MediCore section
* Medical Departments section
* User Testimonials section
* Emergency Support functionality
* Specialist exploration page
* Appointment booking access

### Specialists Page

The Specialists page allows visitors to:

* View available doctors
* Check specialization
* View years of experience
* Book consultations directly
* Navigate back to homepage

Available Specializations:

* Cardiology
* Neurology
* Orthopedics
* Pediatrics
* Dermatology
* Oncology

### Appointment Booking

Patients can:

* Enter personal information
* Select doctor
* Choose appointment date
* Select appointment time
* Submit appointment request

Specialist booking is integrated with doctor cards.

When a patient clicks **Book Consultation** from a doctor card, the selected doctor is automatically passed to the appointment page.

### Emergency Support

The landing page includes a dedicated Emergency Support button for immediate patient assistance.

---

## Staff Authentication

### Login System

The application includes a staff login portal.

Features:

* Staff Login page
* Route protection
* Session persistence using Local Storage
* Dashboard access control

Protected pages require authentication before access.

Public routes:

```text
/
 /login
 /doctors-list
 /book-appointment
```

Protected routes:

```text
/dashboard
/patients
/doctors
/appointments
/treatments
/billing
```

---

## Database Schema (PostgreSQL)

```text
doctors      ←─┐
patients     ←─┼── appointments ←── treatments ←── billing
               └──────────────────────────────────────────┘
```

### Tables

| Table        | Primary Key    | Foreign Keys                                     |
| ------------ | -------------- | ------------------------------------------------ |
| doctors      | doctor_id      | —                                                |
| patients     | patient_id     | —                                                |
| appointments | appointment_id | patient_id → patients, doctor_id → doctors       |
| treatments   | treatment_id   | appointment_id → appointments                    |
| billing      | bill_id        | patient_id → patients, treatment_id → treatments |

---

## API Endpoints

### Authentication

| Method | Endpoint        | Description               |
| ------ | --------------- | ------------------------- |
| GET    | /api/auth/login | Authentication route test |
| POST   | /api/auth/login | Staff Login               |

---

### Dashboard (Analytics)

| Method | Endpoint                             | Description              |
| ------ | ------------------------------------ | ------------------------ |
| GET    | /api/dashboard/stats                 | KPI summary              |
| GET    | /api/dashboard/appointments-by-month | Monthly appointment data |
| GET    | /api/dashboard/revenue-by-month      | Monthly revenue data     |
| GET    | /api/dashboard/treatment-types       | Treatment breakdown      |
| GET    | /api/dashboard/top-doctors           | Top 10 doctors           |
| GET    | /api/dashboard/insurance-breakdown   | Insurance distribution   |

---

### CRUD Resources

Each resource supports:

* GET (List)
* GET (By ID)
* POST
* PUT
* DELETE

Resources:

```text
/api/patients
/api/doctors
/api/appointments
/api/treatments
/api/billing
```

---

## Query Parameters

### Patients

```text
?search=<name|email|id>&limit=50&offset=0
```

### Doctors

```text
?specialization=<spec>&branch=<branch>
```

### Appointments

```text
?status=<status>
&doctor_id=<id>
&patient_id=<id>
&date_from=<date>
&date_to=<date>
```

### Treatments

```text
?treatment_type=<type>
```

### Billing

```text
?payment_status=<status>
&payment_method=<method>
```

---

## Setup & Running

### PostgreSQL Setup

```bash
psql -U postgres -c "CREATE DATABASE hospital_db;"

psql -U postgres -d hospital_db -f backend/db/schema.sql

psql -U postgres -d hospital_db -f backend/db/seed.sql
```

---

### Backend

```bash
cd backend

npm install

npm run dev
```


---

### Frontend

```bash
cd frontend

npm install

npm start
```



---

## Features

### Dashboard

* KPI Cards
* Revenue Analytics
* Treatment Analytics
* Appointment Statistics
* Insurance Analytics
* Doctor Performance Analytics

### Patient Management

* Add Patient
* Edit Patient
* Delete Patient
* Search Patients
* View Patient Records

### Doctor Management

* Add Doctor
* Edit Doctor
* Delete Doctor
* Filter by Specialization
* View Doctor Profiles

### Appointment Management

* Schedule Appointment
* Update Appointment
* Cancel Appointment
* Status Tracking

### Treatment Management

* Record Treatments
* Categorize Treatment Types
* Treatment Cost Tracking

### Billing Management

* Invoice Generation
* Payment Tracking
* Revenue Reports
* Payment Method Tracking

### Public Portal

* Healthcare Landing Page
* Specialist Directory
* Appointment Booking
* Emergency Support
* Responsive Design

---

## Tech Stack

| Layer          | Technology                     |
| -------------- | ------------------------------ |
| Database       | PostgreSQL 14+                 |
| Backend        | Node.js, Express 4, pg         |
| Frontend       | React 18                       |
| Routing        | React Router 6                 |
| Icons          | React Icons                    |
| Charts         | Recharts                       |
| Styling        | Custom CSS                     |
| Authentication | Local Storage + Express Routes |

---


## Project Status

✅ Frontend Completed

✅ Backend Completed

✅ PostgreSQL Connected

✅ Authentication Implemented

✅ Appointment Booking Implemented

✅ Specialist Directory Implemented

✅ Dashboard Implemented

✅ GitHub Repository Integrated

✅ Hospital Management System Ready
