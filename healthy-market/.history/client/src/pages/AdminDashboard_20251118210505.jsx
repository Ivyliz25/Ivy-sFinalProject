import React, { useEffect, useState } from "react";
import api from "../services/api";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, BarChart, Bar } from "recharts";
import ProductCard from "../components/ProductCard";

const AdminDashboard = () => {
  const [traders, setTraders] = useState([]);
  const [products, setProducts] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTraders = async () => {
      try {
        const { data } = await api.get("/api/traders");
        setTraders(data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/products");
        setProducts(data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchAnalytics = async () => {
      try {
        const { data } = await api.get("/api/analytics");
        setAnalytics(data);
      } catch (err) {
        console.error(err);
      }
    };

    Promise.all([fetchTraders(), fetchProducts(), fetchAnalytics()]).then(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    window.location.href = "/";
  };

  if (loading) return <div className="container"><h1>Loading...</h1></div>;

  return (
    <div className="container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} style={{ padding: "10px 20px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
          Logout
        </button>
      </div>

      {/* Summary Stats */}
      <section style={{ marginBottom: "40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
          <div style={{ padding: "20px", backgroundColor: "#f0f8ff", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
            <h3>Total Traders</h3>
            <p style={{ fontSize: "24px", fontWeight: "bold", color: "#0066cc" }}>{traders.length}</p>
          </div>
          <div style={{ padding: "20px", backgroundColor: "#f0fff0", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
            <h3>Total Products</h3>
            <p style={{ fontSize: "24px", fontWeight: "bold", color: "#009900" }}>{products.length}</p>
          </div>
          <div style={{ padding: "20px", backgroundColor: "#fff0f0", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
            <h3>Analytics Records</h3>
            <p style={{ fontSize: "24px", fontWeight: "bold", color: "#cc0000" }}>{analytics.length}</p>
          </div>
        </div>
      </section>
      <section style={{ marginTop: "20px", marginBottom: "40px" }}>
        <h2>Trader Locations</h2>
        {traders.length > 0 ? (
          <MapContainer
            center={[traders[0].location.lat, traders[0].location.lng]}
            zoom={12}
            style={{ height: "400px", width: "100%", borderRadius: "8px" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            {traders.map((trader) => (
              <Marker
                key={trader._id}
                position={[trader.location.lat, trader.location.lng]}
              >
                <Popup>
                  {trader.name} <br /> {trader.email}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        ) : (
          <p>No trader location data yet.</p>
        )}
      </section>

      {/* Products */}
      <section style={{ marginBottom: "40px" }}>
        <h2>All Products</h2>
        {products.length > 0 ? (
          <div className="grid">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        ) : (
          <p>No products found.</p>
        )}
      </section>

      {/* Analytics */}
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
        ) : (
          <p>No analytics data yet.</p>
        )}
      </section>
    </div>
  );
};

const { data } = await api.get('/api/analytics');
setAnalytics(data);

const totalEmissions = analytics.reduce((sum, a) => sum + (a.emissionKg || 0), 0);
const totalWaste = analytics.reduce((sum, a) => sum + (a.wasteKg || 0), 0);


export default AdminDashboard;
