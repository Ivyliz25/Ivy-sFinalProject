import React, { useEffect, useState } from "react";
import api from "../services/api";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import ProductCard from "../components/ProductCard";

const AdminDashboard = () => {
  const [traders, setTraders] = useState([]);
  const [products, setProducts] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tradersRes, productsRes, analyticsRes] = await Promise.all([
          api.get("/traders"),
          api.get("/products"),
          api.get("/analytics") // ✅ correct path
        ]);
        setTraders(tradersRes.data);
        setProducts(productsRes.data);
        setAnalytics(analyticsRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load data.");
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

  return (
    <div className="container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} style={buttonStyle('#dc3545')}>Logout</button>
      </div>

      {/* Summary Stats */}
      <section style={gridStyle}>
        <StatCard title="Total Traders" value={traders.length} color="#0066cc" />
        <StatCard title="Total Products" value={products.length} color="#009900" />
        <StatCard title="Analytics Records" value={analytics.length} color="#cc0000" />
      </section>

      {/* Trader Locations */}
      <section style={{ marginBottom: "40px" }}>
        <h2>Trader Locations</h2>
        {traders.length > 0 ? (
          <MapContainer center={[traders[0].location.lat, traders[0].location.lng]} zoom={12} style={{ height: "400px", width: "100%", borderRadius: "8px" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
            {traders.map(trader => (
              <Marker key={trader._id} position={[trader.location.lat, trader.location.lng]}>
                <Popup>{trader.name} <br /> {trader.email}</Popup>
              </Marker>
            ))}
          </MapContainer>
        ) : <p>No trader location data yet.</p>}
      </section>

      {/* Products */}
      <section style={{ marginBottom: "40px" }}>
        <h2>All Products</h2>
        {products.length > 0 ? (
          <div className="grid">{products.map(p => <ProductCard key={p._id} product={p} />)}</div>
        ) : <p>No products found.</p>}
      </section>

      {/* Analytics Chart */}
      <section className="chart-container">
        <h2>Community Waste & Emissions Analytics</h2>
        {analytics.length > 0 ? (
          <LineChart width={700} height={300} data={analytics}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="emissionKg" stroke="#8884d8" />
            <Line type="monotone" dataKey="wasteKg" stroke="#82ca9d" />
          </LineChart>
        ) : <p>No analytics data yet.</p>}
      </section>
    </div>
  );
};

// Reusable styles & components
const buttonStyle = (bgColor) => ({
  padding: '10px 20px',
  backgroundColor: bgColor,
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer'
});

const gridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "40px" };

const StatCard = ({ title, value, color }) => (
  <div style={{ padding: '20px', backgroundColor: '#f0f8ff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
    <h3>{title}</h3>
    <p style={{ fontSize: '24px', fontWeight: 'bold', color }}>{value}</p>
  </div>
);

export default AdminDashboard;
