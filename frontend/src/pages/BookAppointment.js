import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function BookAppointment() {
 
const location = useLocation();

const queryParams = new URLSearchParams(location.search);

const selectedDoctor =
  queryParams.get("doctor") || "";

const [form, setForm] = useState({
    name: "",
    phone: "",
    doctor: selectedDoctor,
    date: "",
    time: ""
  });
const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    alert("Appointment Booked Successfully!");

    setForm({
      name: "",
      phone: "",
      doctor: "",
      date: "",
      time: ""
    });
  };

  return (
    <div className="appointment-page">

      <Link to="/" className="back-btn">
        ← Back to Home
      </Link>

      <div className="appointment-card">
        <h1>Book an Appointment</h1>

        <p>
          Schedule an appointment with one of our specialists.
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="name"
            placeholder="Patient Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
          />

                    <select
            name="doctor"
            value={form.doctor}
            onChange={handleChange}
            disabled={selectedDoctor !== ""}
            required
          >
            <option value="">Select Doctor</option>
            <option>Dr. David Taylor</option>
            <option>Dr. Jane Davis</option>
            <option>Dr. Robert Davis</option>
            <option>Dr. Sarah Smith</option>
            <option>Dr. Alex Davis</option>
            <option>Dr. Linda Wilson</option>
          </select>

          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />

          <input
            type="time"
            name="time"
            value={form.time}
            onChange={handleChange}
            required
          />

          <button type="submit">
            Book Appointment
          </button>

        </form>
      </div>
    </div>
  );
}