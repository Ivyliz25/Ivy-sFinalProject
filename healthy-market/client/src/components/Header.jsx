import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header style={{ padding: '10px', background: '#2d6a4f', color: '#fff' }}>
      <h1>Ivy's Healthy Market</h1>
      <nav>
        <Link to="/" style={{ margin: '0 10px', color: '#fff' }}>Home</Link>
        <Link to="/market" style={{ margin: '0 10px', color: '#fff' }}>Market</Link>
        {!token && (
          <>
            <Link to="/login" style={{ margin: '0 10px', color: '#fff' }}>Login</Link>
            <Link to="/register" style={{ margin: '0 10px', color: '#fff' }}>Register</Link>
          </>
        )}
        {token && <button onClick={handleLogout}>Logout</button>}
      </nav>
    </header>
  );
};

export default Header;
