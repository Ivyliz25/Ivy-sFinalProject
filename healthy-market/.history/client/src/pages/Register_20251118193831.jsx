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
      console.log("🔄 1. Starting registration with role:", role);
      
      const res = await api.post("/auth/register", { name, email, password, role });
      console.log("✅ 2. Registration successful:", res.data);
      
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userRole", role);
      
      console.log("💾 3. Stored token:", localStorage.getItem("token"));
      console.log("💾 4. Stored role:", localStorage.getItem("userRole"));
      console.log("🎯 5. Redirecting to:", role + "-dashboard");
      
      // Redirect based on role
      if (role === "admin") {
        navigate("/AdminDashboard");
      } else if (role === "trader") {
        navigate("/TraderDashboard");
      } else {
        navigate("/CustomerDashboard");
      }
      
      console.log("🚀 6. Navigation command completed!");
      
    } catch (err) {
      console.error("❌ Registration error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Registration failed";
      setError(errorMessage);
    }
  };

  // Add a test navigation button
  const testNavigation = () => {
    console.log("🧪 Testing navigation to CustomerDashboard");
    navigate("/CustomerDashboard");
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