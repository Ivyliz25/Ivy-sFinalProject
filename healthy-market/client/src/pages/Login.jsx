import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      console.log("Login response:", res.data);
      
      if (res.data && res.data.token && res.data.user) {
        localStorage.setItem("token", res.data.token);
        const userRole = res.data.user.role;
        console.log("User role:", userRole);
        localStorage.setItem("userRole", userRole);
        
        // redirect based on role
        if (userRole === "admin") {
          console.log("Redirecting to admin-dashboard");
          navigate("/admin-dashboard");
        } else if (userRole === "trader") {
          console.log("Redirecting to trader-dashboard");
          navigate("/trader-dashboard");
        } else {
          console.log("Redirecting to customer-dashboard");
          navigate("/customer-dashboard");
        }
      } else {
        setError("Invalid response from server");
        console.error("Invalid response structure:", res.data);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || err.message || "Login failed");
    }
  };

  return (
    <div className="container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px', marginTop: '20px' }}>
        <input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Login;
