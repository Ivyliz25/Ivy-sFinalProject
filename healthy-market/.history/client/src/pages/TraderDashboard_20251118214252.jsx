import React, { useEffect, useState } from 'react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, BarChart, Bar } from 'recharts';
import { useNavigate } from 'react-router-dom';

const TraderDashboard = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [analytics, setAnalytics] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await api.get('/products');
                setProducts(data);
            } catch (err) {
                console.error(err);
            }
        };

        const fetchAnalytics = async () => {
            try {
                const { data } = await api.get('/analytics/my');
                setAnalytics(data);
            } catch (err) {
                console.error(err);
            }
        };

        Promise.all([fetchProducts(), fetchAnalytics()]).then(() => setLoading(false));
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
                <h1>Trader Dashboard</h1>
                <div>
                    <button 
                        onClick={() => navigate('/trader-profile')}
                        style={{ padding: "10px 20px", marginRight: "10px", backgroundColor: "#2d6a4f", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}
                    >
                        👤 My Profile
                    </button>
                    <button 
                        onClick={() => navigate('/add-product')}
                        style={{ padding: "10px 20px", marginRight: "10px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}
                    >
                        + Add Product
                    </button>
                    <button onClick={handleLogout} style={{ padding: "10px 20px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
                        Logout
                    </button>
                </div>
            </div>

            {/* Summary Stats */}
            <section style={{ marginBottom: "40px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
                    <div style={{ padding: "20px", backgroundColor: "#f0f8ff", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                        <h3>My Products</h3>
                        <p style={{ fontSize: "24px", fontWeight: "bold", color: "#0066cc" }}>{products.length}</p>
                    </div>
                    <div style={{ padding: "20px", backgroundColor: "#fff0f0", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                        <h3>Total Emissions</h3>
                        <p style={{ fontSize: "24px", fontWeight: "bold", color: "#cc0000" }}>
                            {analytics.reduce((sum, a) => sum + (a.emissionKg || 0), 0).toFixed(2)} kg
                        </p>
                    </div>
                    <div style={{ padding: "20px", backgroundColor: "#f0fff0", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                        <h3>Total Waste</h3>
                        <p style={{ fontSize: "24px", fontWeight: "bold", color: "#009900" }}>
                            {analytics.reduce((sum, a) => sum + (a.wasteKg || 0), 0).toFixed(2)} kg
                        </p>
                    </div>
                </div>
            </section>

            {/* My Products Section */}
            <section style={{ marginBottom: "40px" }}>
                <h2>My Products</h2>
                {products.length > 0 ? (
                    <div className="grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
                        {products.map(p => <ProductCard key={p._id} product={p} />)}
                    </div>
                ) : (
                    <p>No products added yet.</p>
                )}
            </section>

            {/* Analytics Chart */}
            <section style={{ marginBottom: "40px" }}>
                <h2>Waste & Emissions Over Time</h2>
                {analytics.length > 0 ? (
                    <LineChart width={800} height={300} data={analytics} style={{ marginTop: "20px" }}>
                        <CartesianGrid stroke="#ccc" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="emissionKg" stroke="#ff7300" name="Emissions (kg)" />
                        <Line type="monotone" dataKey="wasteKg" stroke="#82ca9d" name="Waste (kg)" />
                    </LineChart>
                ) : (
                    <p>No analytics data available yet.</p>
                )}
            </section>
        </div>
    );
};

const { data } = await api.get('/api/analytics/my');
setAnalytics(data);

analytics.reduce((sum, a) => sum + (a.emissionKg || 0), 0).toFixed(2)


export default TraderDashboard;
