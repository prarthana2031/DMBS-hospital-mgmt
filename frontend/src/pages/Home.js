import React from "react";
import { Link } from "react-router-dom";
import {
  FaUserMd,
  FaUserInjured,
  FaCalendarCheck,
  FaMoneyBillWave,
  FaChartLine,
  FaDollarSign
} from "react-icons/fa";

export default function Home() {
  return (
    <div className="home">

      <nav className="navbar">
        <h2>MediCore</h2>

        <div className="nav-links">
            <Link to="/login" className="nav-btn">
               Staff Login
            </Link>
        </div>
      </nav>
 
      <section className="hero">
        <div className="hero-left">
          <span className="badge">
            Healthcare Management Platform
          </span>

          <h1>
            Smart Hospital
            <br />
            Management System
          </h1>

          <p>
            Empowering healthcare organizations with
            intelligent patient management, seamless
            appointment scheduling, secure medical records
            and automated billing solutions.
          </p>

          <Link to="/doctors-list" className="hero-btn">
              Explore Specialists
          </Link>
          </div>

          <div className="hero-right">
            <img src="/hero.png" alt="Hospital Management System" />
        </div>
      </section>

      <section className="stats">
       <div className="stat-card">
            <FaUserInjured className="stat-icon"/>
            <h2>51+</h2>
            <p>Patients Served</p>
          </div>

          <div className="stat-card">
            <FaUserMd className="stat-icon"/>
            <h2>10+</h2>
            <p>Specialist Doctors</p>
          </div>

          <div className="stat-card">
            <FaCalendarCheck className="stat-icon"/>
            <h2>200+</h2>
            <p>Appointments</p>
          </div>

          <div className="stat-card">
            <FaDollarSign className="stat-icon"/>
            <h2>$551K</h2>
            <p>Revenue Generated</p>
          </div>
      </section>

      <section className="features">
        <h2>Everything You Need</h2>

        <div className="feature-grid">

          <div className="card">
            <FaUserInjured size={35}/>
            <h3>Patient Record</h3>
            <p>Manage patient information securely.</p>
          </div>

          <div className="card">
            <FaUserMd size={35}/>
            <h3>Doctor Management</h3>
            <p>Organize specialists and schedules.</p>
          </div>

          <div className="card">
            <FaCalendarCheck size={35}/>
            <h3>Appointments</h3>
            <p>Track and schedule consultations.</p>
          </div>

          <div className="card">
            <FaMoneyBillWave size={35}/>
            <h3>Billing System</h3>
            <p>Generate invoices and payments.</p>
          </div>

          <div className="card">
            <FaChartLine size={35}/>
            <h3>Analytics Dashboard</h3>
            <p>Monitor hospital performance.</p>
          </div>

        </div>
      </section>

<section className="why-us">
  <h2>Why Choose MediCore?</h2>

  <div className="why-grid">
    <div className="why-card">
      <h3>⚡ Faster Operations</h3>
      <p>Reduce paperwork and streamline hospital workflows.</p>
    </div>

    <div className="why-card">
      <h3>🔒 Secure Records</h3>
      <p>Cloud-based storage with secure patient management.</p>
    </div>

    <div className="why-card">
      <h3>📊 Real-Time Analytics</h3>
      <p>Monitor appointments, treatments and revenue instantly.</p>
    </div>

    <div className="why-card">
      <h3>☁ Cloud Database</h3>
      <p>Powered by PostgreSQL on Supabase cloud infrastructure.</p>
    </div>
  </div>
</section>

<section className="departments">
  <h2>Medical Departments</h2>

  <div className="dept-grid">
    <div className="dept-card">🫀 Cardiology</div>
    <div className="dept-card">🧠 Neurology</div>
    <div className="dept-card">🦴 Orthopedics</div>
    <div className="dept-card">👶 Pediatrics</div>
    <div className="dept-card">🩺 Dermatology</div>
    <div className="dept-card">🎗 Oncology</div>
  </div>
</section>

<section className="testimonials">
  <h2>What Our Users Say</h2>

  <div className="testimonial-grid">
    <div className="testimonial-card">
      ⭐⭐⭐⭐⭐
      <p>MediCore transformed our hospital workflow completely.</p>
    </div>

    <div className="testimonial-card">
      ⭐⭐⭐⭐⭐
      <p>Appointment scheduling is now effortless and efficient.</p>
    </div>

    <div className="testimonial-card">
      ⭐⭐⭐⭐⭐
      <p>Billing management became much easier.</p>
    </div>
  </div>
</section>
 <section className="top-doctors">
  <h2>Meet Our Specialists</h2>

  <div className="top-doctors-grid">

    <div className="doctor-preview">
      <h3>Dr. Jane Davis</h3>
      <p>Pediatrics</p>
      <span>24 Years Experience</span>
    </div>

    <div className="doctor-preview">
      <h3>Dr. Robert Davis</h3>
      <p>Oncology</p>
      <span>26 Years Experience</span>
    </div>

    <div className="doctor-preview">
      <h3>Dr. David Taylor</h3>
      <p>Dermatology</p>
      <span>17 Years Experience</span>
    </div>

  </div>

  <Link to="/doctors-list" className="hero-btn">
    View All Doctors
  </Link>
</section>

<section className="appointment-process">
  <h2>How It Works</h2>

  <div className="process-grid">

    <div className="process-card">
      <h3>1</h3>
      <p>Choose Specialist</p>
    </div>

    <div className="process-card">
      <h3>2</h3>
      <p>Select Date & Time</p>
    </div>

    <div className="process-card">
      <h3>3</h3>
      <p>Confirm Appointment</p>
    </div>

  </div>
</section>

<section className="emergency-banner">
  <h2>24/7 Emergency Services</h2>

  <p>
    Immediate medical assistance available
    round the clock for all emergencies.
  </p>

  <button
    onClick={() =>
      alert("Emergency Helpline: 108")
    }
  >
    Emergency Support
  </button>
</section>


<section className="cta">
  <h2>Ready to Modernize Healthcare?</h2>

  <Link to="/book-appointment" className="hero-btn">
    Book Appointment
  </Link>
</section>
<footer className="footer">

  <div>
    <h3>MediCore</h3>
    <p>Smart Hospital Management System</p>
  </div>

  <div>
    <h4>Services</h4>
    <p>Doctors</p>
    <p>Appointments</p>
    <p>Treatments</p>
  </div>

  <div>
    <h4>Contact</h4>
    <p>Email: info@medicore.com</p>
    <p>Phone: +91 9876543210</p>
  </div>

</footer>
    </div>
  );
}
