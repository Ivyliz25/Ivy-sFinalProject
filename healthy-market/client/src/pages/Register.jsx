import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer"); 
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/register", { name, email, password, role });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userRole", role);
      // Redirect based on role
      if (role === "admin") navigate("/admin-dashboard");
      else if (role === "trader") navigate("/trader-dashboard");
      else navigate("/customer-dashboard");
    } catch (err) {
      console.error("Registration error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Registration failed";
      setError(errorMessage);
    }
  };

  return (
    <div className="container">
      <h1>Register</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px', marginTop: '20px' }}>
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
        <input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <select value={role} onChange={e => setRole(e.target.value)}>
          <option value="customer">Customer</option>
          <option value="trader">Trader</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Register</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Register;

