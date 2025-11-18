import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import api from "../services/api.js"; 
import ProductCard from "../components/ProductCard.jsx";

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products"); 
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  // Public (unauthenticated) hero view
  const publicHero = (
    <div style={{ display: 'flex', gap: '20px', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
      <div style={{ flex: 1 }}>
        <h1 style={{ margin: 0 }}>Healthy Market</h1>
        <p style={{ marginTop: '8px' }}>Discover sustainable products and trusted traders near you.</p>
        <div className="hero-ctas" style={{ marginTop: '12px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link to="/market"><button className="hero-cta hero-cta-primary">Visit Market</button></Link>
          <Link to="/inspect"><button className="hero-cta hero-cta-secondary">Inspect Traders</button></Link>
          <Link to="/register"><button className="hero-cta hero-cta-tertiary">Join Now</button></Link>
        </div>
      </div>
      <div style={{ width: '320px', textAlign: 'center' }}>
      </div>
    </div>
  );

  // Authenticated dashboard cards (role-specific)
  const authCards = (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '30px' }}>
      {/* Customer dashboard only for customers */}
      {userRole === 'customer' && (
        <Link to="/customer-dashboard" style={{ textDecoration: 'none' }}>
          <div style={{ padding: '18px', borderRadius: '8px', background: '#f1f5f9', cursor: 'pointer' }}>
            <h3>Customer Dashboard</h3>
            <p style={{ margin: 0 }}>View personalized shopping, cart and recommendations.</p>
          </div>
        </Link>
      )}

      <Link to="/market" style={{ textDecoration: 'none' }}>
        <div style={{ padding: '18px', borderRadius: '8px', background: '#e6fffa', cursor: 'pointer' }}>
          <h3>Market</h3>
          <p style={{ margin: 0 }}>Browse all available products.</p>
        </div>
      </Link>

      <Link to="/inspect" style={{ textDecoration: 'none' }}>
        <div style={{ padding: '18px', borderRadius: '8px', background: '#fff7ed', cursor: 'pointer' }}>
          <h3>Inspect</h3>
          <p style={{ margin: 0 }}>Inspect traders and their sustainability records.</p>
        </div>
      </Link>

      <Link to="/products-available" style={{ textDecoration: 'none' }}>
        <div style={{ padding: '18px', borderRadius: '8px', background: '#f8fafc', cursor: 'pointer' }}>
          <h3>Products Available</h3>
          <p style={{ margin: 0 }}>See all products available across categories.</p>
        </div>
      </Link>

      {/* Admin dashboard only for admins */}
      {userRole === 'admin' && (
        <Link to="/admin-dashboard" style={{ textDecoration: 'none' }}>
          <div style={{ padding: '18px', borderRadius: '8px', background: '#eef2ff', cursor: 'pointer' }}>
            <h3>Admin Dashboard</h3>
            <p style={{ margin: 0 }}>Admin controls for site management.</p>
          </div>
        </Link>
      )}

      {/* Trader dashboard only for traders */}
      {userRole === 'trader' && (
        <Link to="/trader-dashboard" style={{ textDecoration: 'none' }}>
          <div style={{ padding: '18px', borderRadius: '8px', background: '#f0fdf4', cursor: 'pointer' }}>
            <h3>Trader Dashboard</h3>
            <p style={{ margin: 0 }}>Manage your products and emissions.</p>
          </div>
        </Link>
      )}
    </div>
  );

  return (
    <div className="container">
      {token ? authCards : publicHero}

      <h2 style={{ marginTop: '10px' }}>Featured Products</h2>
      <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
        {products.length === 0 ? (
          <p>No products yet</p>
        ) : (
          products.map(p => (
            <div key={p._id} className="card" style={{ padding: '12px' }}>
              <ProductCard product={p} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;

