import React, { useEffect, useState } from 'react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';

const TraderDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, analyticsRes] = await Promise.all([
          api.get('/products'),
          api.get('/analytics/my') // ✅ correct path
        ]);
        setProducts(productsRes.data);
        setAnalytics(analyticsRes.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    window.location.href = "/";
  };

  if (loading) return <div className="container"><h1>Loading...</h1></div>;
  if (error) return <div className="container"><h1>{error}</h1></div>;

  const totalEmissions = analytics.reduce((sum, a) => sum + (a.emissionKg || 0), 0).toFixed(2);
  const totalWaste = analytics.reduce((sum, a) => sum + (a.wasteKg || 0), 0).toFixed(2);

  return (
    <div className="container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1>Trader Dashboard</h1>
        <div>
          <button onClick={() => navigate('/trader-profile')} style={buttonStyle('#2d6a4f', '10px 20px', '10px')}>👤 My Profile</button>
          <button onClick={() => navigate('/add-product')} style={buttonStyle('#4CAF50', '10px 20px', '10px')}>+ Add Product</button>
          <button onClick={handleLogout} style={buttonStyle('#dc3545', '10px 20px')}>Logout</button>
        </div>
      </div>

      {/* Summary Stats */}
      <section style={gridStyle}>
        <StatCard title="My Products" value={products.length} color="#0066cc" />
        <StatCard title="Total Emissions" value={`${totalEmissions} kg`} color="#cc0000" />
        <StatCard title="Total Waste" value={`${totalWaste} kg`} color="#009900" />
      </section>

      {/* My Products */}
      <section style={{ marginBottom: '40px' }}>
        <h2>My Products</h2>
        {products.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
            {products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        ) : <p>No products added yet.</p>}
      </section>

      {/* Analytics Chart */}
      <section style={{ marginBottom: '40px' }}>
        <h2>Waste & Emissions Over Time</h2>
        {analytics.length > 0 ? (
          <LineChart width={800} height={300} data={analytics}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="emissionKg" stroke="#ff7300" name="Emissions (kg)" />
            <Line type="monotone" dataKey="wasteKg" stroke="#82ca9d" name="Waste (kg)" />
          </LineChart>
        ) : <p>No analytics data available yet.</p>}
      </section>
    </div>
  );
};

// Reusable styles & components
const buttonStyle = (bgColor, padding, marginRight = 0) => ({
  padding,
  marginRight,
  backgroundColor: bgColor,
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontWeight: 'bold'
});

const gridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "40px" };

const StatCard = ({ title, value, color }) => (
  <div style={{ padding: '20px', backgroundColor: '#f0f8ff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
    <h3>{title}</h3>
    <p style={{ fontSize: '24px', fontWeight: 'bold', color }}>{value}</p>
  </div>
);

export default TraderDashboard;
