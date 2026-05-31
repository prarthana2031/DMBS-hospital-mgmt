import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch(
      "http://localhost:5000/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      }
    );

    const data = await res.json();

    if (data.success) {

      localStorage.setItem(
        "staffUser",
        JSON.stringify(data.user)
      );

      navigate("/dashboard");

    } else {
      alert("Invalid Credentials");
    }

  } catch (err) {
    console.error(err);
    alert("Login failed");
  }
};
  return (
    <div className="login-page">
      <div className="login-card">
        <h1>MediCore</h1>
        <p>Hospital Management System</p>

        <p className="login-hint">Demo: admin / admin123</p>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}