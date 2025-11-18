import React, { useEffect, useState } from 'react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import EmissionBadge from '../components/EmissionBadge';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useNavigate, Link } from 'react-router-dom';

const CustomerDashboard = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cartItems, setCartItems] = useState([]);

    // Load cart from localStorage
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                setCartItems(JSON.parse(savedCart));
            } catch (error) {
                console.error('Error parsing cart data:', error);
                setCartItems([]);
            }
        }
    }, []);

    // Save cart to localStorage whenever cart changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await api.get('/products');
                setProducts(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Unified cart functions
    const addToCart = (product) => {
        setCartItems(prevCart => {
            const existingItem = prevCart.find(item => item._id === product._id);
            
            if (existingItem) {
                return prevCart.map(item =>
                    item._id === product._id
                        ? { ...item, quantity: (item.quantity || 1) + 1 }
                        : item
                );
            } else {
                return [...prevCart, {
                    ...product,
                    quantity: 1
                }];
            }
        });
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) {
            setCartItems(prevCart => prevCart.filter(item => item._id !== productId));
            return;
        }
        
        setCartItems(prevCart =>
            prevCart.map(item =>
                item._id === productId
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };

    const getCartItemCount = () => {
        return cartItems.reduce((count, item) => count + (item.quantity || 1), 0);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("cart");
        window.location.href = "/";
    };

    if (loading) return <div className="container"><h1>Loading...</h1></div>;

    // Calculate emissions statistics
    const totalEmissions = products.reduce((sum, p) => sum + (p.carbonEmission || 0), 0);
    const avgEmissions = products.length > 0 ? (totalEmissions / products.length).toFixed(2) : 0;
    const lowEmissionProducts = products.filter(p => (p.carbonEmission || 0) < 5).length;

    // Data for pie chart
    const emissionData = [
        { name: 'Low Emission Products', value: lowEmissionProducts },
        { name: 'High Emission Products', value: products.length - lowEmissionProducts }
    ];

    const COLORS = ['#82ca9d', '#ff7300'];

    return (
        <div className="container">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                <h1>Customer Dashboard</h1>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <Link to="/cart" style={{ textDecoration: 'none' }}>
                        <button
                            style={{
                                padding: "10px 20px",
                                backgroundColor: "#ff9800",
                                color: "white",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                                position: "relative"
                            }}
                        >
                            🛒 Cart ({getCartItemCount()})
                        </button>
                    </Link>
                    <Link to="/products-available">
                        <button style={{ 
                            padding: "10px 20px", 
                            backgroundColor: "#2d6a4f", 
                            color: "white", 
                            border: "none", 
                            borderRadius: "5px", 
                            cursor: "pointer" 
                        }}>
                            Browse Products
                        </button>
                    </Link>
                    <button onClick={handleLogout} style={{ padding: "10px 20px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
                        Logout
                    </button>
                </div>
            </div>

            {/* Welcome Section */}
            <section style={{ marginBottom: "30px", padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
                <h2>Welcome to Ivy's Healthy Market</h2>
                <p>Browse eco-friendly products and make a difference! We help you choose products with lower carbon emissions.</p>
                <p>Items in your cart: <strong>{getCartItemCount()}</strong></p>
            </section>

            {/* Sustainability Stats */}
            <section style={{ marginBottom: "40px" }}>
                <h2>Your Sustainability Impact</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
                    <div style={{ padding: "20px", backgroundColor: "#e8f5e9", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                        <h3>Available Products</h3>
                        <p style={{ fontSize: "24px", fontWeight: "bold", color: "#2e7d32" }}>{products.length}</p>
                        <p style={{ fontSize: "14px", color: "#666" }}>eco-friendly items</p>
                    </div>
                    <div style={{ padding: "20px", backgroundColor: "#fff3e0", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                        <h3>Low Emission Options</h3>
                        <p style={{ fontSize: "24px", fontWeight: "bold", color: "#e65100" }}>{lowEmissionProducts}</p>
                        <p style={{ fontSize: "14px", color: "#666" }}>under 5kg CO2</p>
                    </div>
                    <div style={{ padding: "20px", backgroundColor: "#f3e5f5", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                        <h3>Average Emissions</h3>
                        <p style={{ fontSize: "24px", fontWeight: "bold", color: "#6a1b9a" }}>{avgEmissions}</p>
                        <p style={{ fontSize: "14px", color: "#666" }}>kg CO2 per product</p>
                    </div>
                </div>
            </section>

            {/* Emissions Distribution Chart */}
            {products.length > 0 && (
                <section style={{ marginBottom: "40px" }}>
                    <h2>Product Emissions Distribution</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={emissionData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, value }) => `${name}: ${value}`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {COLORS.map((color, index) => (
                                    <Cell key={`cell-${index}`} fill={color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </section>
            )}

            {/* Featured Products */}
            <section style={{ marginBottom: "40px" }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2>Featured Products</h2>
                    <Link to="/products-available">
                        <button style={{ 
                            padding: "8px 16px", 
                            backgroundColor: "transparent", 
                            color: "#2d6a4f", 
                            border: "1px solid #2d6a4f", 
                            borderRadius: "5px", 
                            cursor: "pointer" 
                        }}>
                            View All Products
                        </button>
                    </Link>
                </div>
                <p style={{ color: "#666", marginBottom: "20px" }}>Browse our collection of sustainable, eco-friendly products:</p>
                {products.length > 0 ? (
                    <div className="grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
                        {products.slice(0, 6).map(product => {
                            const cartItem = cartItems.find(item => item._id === product._id);
                            const quantityInCart = cartItem ? cartItem.quantity : 0;
                            
                            return (
                                <div key={product._id} style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "15px", backgroundColor: "white", position: 'relative' }}>
                                    {quantityInCart > 0 && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '10px',
                                            right: '10px',
                                            background: '#2d6a4f',
                                            color: 'white',
                                            borderRadius: '50%',
                                            width: '25px',
                                            height: '25px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '12px',
                                            fontWeight: 'bold'
                                        }}>
                                            {quantityInCart}
                                        </div>
                                    )}
                                    <ProductCard product={product} />
                                    <div style={{ marginTop: "15px" }}>
                                        {product.carbonEmission && (
                                            <EmissionBadge emission={product.carbonEmission} />
                                        )}
                                        
                                        {quantityInCart > 0 ? (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', marginTop: '10px' }}>
                                                <button
                                                    onClick={() => updateQuantity(product._id, quantityInCart - 1)}
                                                    style={{
                                                        padding: '5px 10px',
                                                        background: '#dc3545',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    -
                                                </button>
                                                <span style={{ fontWeight: 'bold' }}>{quantityInCart}</span>
                                                <button
                                                    onClick={() => updateQuantity(product._id, quantityInCart + 1)}
                                                    style={{
                                                        padding: '5px 10px',
                                                        background: '#28a745',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => addToCart(product)}
                                                style={{
                                                    width: "100%",
                                                    padding: "10px",
                                                    marginTop: "10px",
                                                    backgroundColor: "#4CAF50",
                                                    color: "white",
                                                    border: "none",
                                                    borderRadius: "5px",
                                                    cursor: "pointer",
                                                    fontSize: "16px"
                                                }}
                                            >
                                                Add to Cart
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p>No products available at the moment.</p>
                )}
            </section>

            {/* Educational Section */}
            <section style={{ padding: "20px", backgroundColor: "#e3f2fd", borderRadius: "8px", marginBottom: "20px" }}>
                <h2>Why Choose Sustainable Products?</h2>
                <ul style={{ lineHeight: "1.8" }}>
                    <li><strong>Reduce Carbon Footprint:</strong> Every sustainable choice reduces CO2 emissions and helps combat climate change.</li>
                    <li><strong>Support Ethical Traders:</strong> Your purchases support traders committed to environmental responsibility.</li>
                    <li><strong>Better Quality:</strong> Sustainable products are often made with higher standards and better materials.</li>
                    <li><strong>Make a Difference:</strong> Join thousands of customers making eco-conscious choices every day.</li>
                </ul>
            </section>
        </div>
    );
};

export default CustomerDashboard;