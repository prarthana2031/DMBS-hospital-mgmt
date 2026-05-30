import React from "react";
import { Link } from "react-router-dom";
import { FaUserMd, FaHeartbeat, FaArrowLeft } from "react-icons/fa";

export default function DoctorsList() {
  const doctors = [
    {
      name: "Dr. David Taylor",
      specialization: "Dermatology",
      experience: "17 Years"
    },
    {
      name: "Dr. Jane Davis",
      specialization: "Pediatrics",
      experience: "24 Years"
    },
    {
      name: "Dr. Robert Davis",
      specialization: "Oncology",
      experience: "26 Years"
    },
    {
      name: "Dr. Sarah Smith",
      specialization: "Pediatrics",
      experience: "21 Years"
    },
    {
      name: "Dr. Alex Davis",
      specialization: "Dermatology",
      experience: "23 Years"
    },
    {
      name: "Dr. Linda Wilson",
      specialization: "Oncology",
      experience: "26 Years"
    }
  ];

  return (
    <div className="doctor-page">

      <div className="doctor-header">
        <Link to="/" className="back-btn">
          <FaArrowLeft /> Back
        </Link>

        <h1>Our Specialists</h1>

        <p>
          Meet our experienced medical professionals dedicated
          to providing exceptional healthcare services.
        </p>
      </div>

      <div className="doctor-grid">
        {doctors.map((doctor, index) => (
          <div className="doctor-card" key={index}>
            <FaUserMd className="doctor-icon" />

            <h3>{doctor.name}</h3>

            <div className="specialization">
              <FaHeartbeat />
              {doctor.specialization}
            </div>

            <p>{doctor.experience} Experience</p>

                <Link
          to={`/book-appointment?doctor=${doctor.name}`}
          className="book-btn"
        >
          Book Consultation
        </Link>
          </div>
        ))}
      </div>

    </div>
  );
}