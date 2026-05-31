-- ============================================================
-- Hospital Management System - PostgreSQL Schema
-- ============================================================

-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS billing CASCADE;
DROP TABLE IF EXISTS treatments CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS patients CASCADE;
DROP TABLE IF EXISTS doctors CASCADE;
DROP TABLE IF EXISTS staff CASCADE;

-- ============================================================
-- DOCTORS
-- ============================================================
CREATE TABLE doctors (
    doctor_id       VARCHAR(10) PRIMARY KEY,
    first_name      VARCHAR(50) NOT NULL,
    last_name       VARCHAR(50) NOT NULL,
    specialization  VARCHAR(100) NOT NULL,
    phone_number    VARCHAR(20),
    years_experience INT,
    hospital_branch VARCHAR(100),
    email           VARCHAR(100) UNIQUE
);

-- ============================================================
-- PATIENTS
-- ============================================================
CREATE TABLE patients (
    patient_id          VARCHAR(10) PRIMARY KEY,
    first_name          VARCHAR(50) NOT NULL,
    last_name           VARCHAR(50) NOT NULL,
    gender              CHAR(1) CHECK (gender IN ('M', 'F', 'O')),
    date_of_birth       DATE,
    contact_number      VARCHAR(20),
    address             VARCHAR(200),
    registration_date   DATE,
    insurance_provider  VARCHAR(100),
    insurance_number    VARCHAR(50),
    email               VARCHAR(100)
);

-- ============================================================
-- APPOINTMENTS
-- ============================================================
CREATE TABLE appointments (
    appointment_id      VARCHAR(10) PRIMARY KEY,
    patient_id          VARCHAR(10) NOT NULL REFERENCES patients(patient_id) ON DELETE CASCADE,
    doctor_id           VARCHAR(10) NOT NULL REFERENCES doctors(doctor_id) ON DELETE CASCADE,
    appointment_date    DATE NOT NULL,
    appointment_time    TIME NOT NULL,
    reason_for_visit    VARCHAR(100),
    status              VARCHAR(20) CHECK (status IN ('Scheduled', 'Completed', 'Cancelled', 'No-show'))
);

-- ============================================================
-- TREATMENTS
-- ============================================================
CREATE TABLE treatments (
    treatment_id        VARCHAR(10) PRIMARY KEY,
    appointment_id      VARCHAR(10) NOT NULL REFERENCES appointments(appointment_id) ON DELETE CASCADE,
    treatment_type      VARCHAR(100) NOT NULL,
    description         VARCHAR(200),
    cost                NUMERIC(10, 2) NOT NULL,
    treatment_date      DATE NOT NULL
);

-- ============================================================
-- BILLING
-- ============================================================
CREATE TABLE billing (
    bill_id             VARCHAR(10) PRIMARY KEY,
    patient_id          VARCHAR(10) NOT NULL REFERENCES patients(patient_id) ON DELETE CASCADE,
    treatment_id        VARCHAR(10) NOT NULL REFERENCES treatments(treatment_id) ON DELETE CASCADE,
    bill_date           DATE NOT NULL,
    amount              NUMERIC(10, 2) NOT NULL,
    payment_method      VARCHAR(30) CHECK (payment_method IN ('Cash', 'Credit Card', 'Insurance')),
    payment_status      VARCHAR(20) CHECK (payment_status IN ('Paid', 'Pending', 'Failed'))
);

-- ============================================================
-- STAFF (login)
-- ============================================================
CREATE TABLE staff (
    staff_id    VARCHAR(10) PRIMARY KEY,
    first_name  VARCHAR(50) NOT NULL,
    last_name   VARCHAR(50) NOT NULL,
    username    VARCHAR(50) UNIQUE NOT NULL,
    password    VARCHAR(100) NOT NULL,
    role        VARCHAR(50),
    email       VARCHAR(100)
);

-- ============================================================
-- INDEXES for performance
-- ============================================================
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor  ON appointments(doctor_id);
CREATE INDEX idx_appointments_date    ON appointments(appointment_date);
CREATE INDEX idx_appointments_status  ON appointments(status);
CREATE INDEX idx_treatments_appointment ON treatments(appointment_id);
CREATE INDEX idx_billing_patient      ON billing(patient_id);
CREATE INDEX idx_billing_treatment    ON billing(treatment_id);
CREATE INDEX idx_billing_status       ON billing(payment_status);

-- ============================================================
-- TRIGGERS for integrity and derived values
-- ============================================================

CREATE FUNCTION appointments_set_default_status() RETURNS trigger AS $$
BEGIN
    IF NEW.status IS NULL THEN
        NEW.status := 'Scheduled';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER appointments_default_status
BEFORE INSERT ON appointments
FOR EACH ROW EXECUTE FUNCTION appointments_set_default_status();

CREATE FUNCTION treatments_validate_date() RETURNS trigger AS $$
DECLARE
    appt_date DATE;
BEGIN
    SELECT appointment_date INTO appt_date
    FROM appointments
    WHERE appointment_id = NEW.appointment_id;

    IF appt_date IS NULL THEN
        RAISE EXCEPTION 'Appointment % does not exist', NEW.appointment_id;
    END IF;

    IF NEW.treatment_date < appt_date THEN
        RAISE EXCEPTION 'Treatment date (%) cannot be before appointment date (%)', NEW.treatment_date, appt_date;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER treatments_date_check
BEFORE INSERT OR UPDATE ON treatments
FOR EACH ROW EXECUTE FUNCTION treatments_validate_date();

CREATE FUNCTION billing_validate_and_set_amount() RETURNS trigger AS $$
DECLARE
    expected_patient_id VARCHAR(10);
BEGIN
    SELECT a.patient_id
    INTO expected_patient_id
    FROM treatments t
    JOIN appointments a ON a.appointment_id = t.appointment_id
    WHERE t.treatment_id = NEW.treatment_id;

    IF expected_patient_id IS NULL THEN
        RAISE EXCEPTION 'Invalid treatment_id %', NEW.treatment_id;
    END IF;

    IF NEW.patient_id <> expected_patient_id THEN
        RAISE EXCEPTION 'Billing patient_id % does not match treatment patient %', NEW.patient_id, expected_patient_id;
    END IF;

    NEW.amount := (SELECT cost FROM treatments WHERE treatment_id = NEW.treatment_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER billing_validate_and_set_amount
BEFORE INSERT OR UPDATE ON billing
FOR EACH ROW EXECUTE FUNCTION billing_validate_and_set_amount();
