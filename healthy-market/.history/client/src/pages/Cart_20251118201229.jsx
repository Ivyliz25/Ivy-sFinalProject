import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalEmissions, setTotalEmissions] = useState(0);

    useEffect(() => {
        // Load cart from localStorage
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            const items = JSON.parse(savedCart);
            setCartItems(items);
            calculateTotals(items);
        }
    }, []);

    const calculateTotals = (items) => {
        const price = items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
        const emissions = items.reduce((sum, item) => sum + (item.carbonEmission || 0) * (item.quantity || 1), 0);
        setTotalPrice(price);
        setTotalEmissions(emissions);
    };

    const removeItem = (productId) => {
        const updatedCart = cartItems.filter(item => item._id !== productId);
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        calculateTotals(updatedCart);
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeItem(productId);
            return;
        }
        const updatedCart = cartItems.map(item =>
            item._id === productId ? { ...item, quantity } : item
        );
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        calculateTotals(updatedCart);
    };

    const handleCheckout = async () => {
        if (cartItems.length === 0) {
            alert('Cart is empty');
            return;
        }

        try {
            const orderData = {
                items: cartItems,
                totalPrice,
                totalEmissions,
                orderDate: new Date()
            };

            // Send order to backend
            const response = await api.post('/api/orders', orderData);
            
            if (response.status === 201) {
                alert('Order placed successfully!');
                localStorage.removeItem('cart');
                setCartItems([]);
                setTotalPrice(0);
                setTotalEmissions(0);
                navigate('/customer-dashboard');
            }
        } catch (err) {
            console.error('Checkout error:', err);
            alert('Error placing order: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("cart");
        window.location.href = "/";
    };

    return (
        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                <h1>Shopping Cart</h1>
                <div>
                    <button 
                        onClick={() => navigate('/customer-dashboard')}
                        style={{ padding: "10px 20px", marginRight: "10px", backgroundColor: "#0066cc", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
                    >
                        Continue Shopping
                    </button>
                    <button 
                        onClick={handleLogout}
                        style={{ padding: "10px 20px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
                    >
                        Logout
                    </button>
                </div>
            </div>

            {cartItems.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
                    <h2>Your cart is empty</h2>
                    <p>Start adding some eco-friendly products!</p>
                    <button
                        onClick={() => navigate('/customer-dashboard')}
                        style={{ padding: "10px 20px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", marginTop: "20px" }}
                    >
                        Continue Shopping
                    </button>
                </div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "30px" }}>
                    {/* Cart Items */}
                    <div>
                        <h2>Items ({cartItems.length})</h2>
                        <div style={{ backgroundColor: "white", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                            {cartItems.map((item) => (
                                <div
                                    key={item._id}
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "80px 1fr 100px 100px 100px",
                                        gap: "20px",
                                        alignItems: "center",
                                        padding: "20px",
                                        borderBottom: "1px solid #eee"
                                    }}
                                >
                                    {/* Product Image */}
                                    <div style={{ backgroundColor: "#f0f0f0", borderRadius: "8px", height: "80px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <span style={{ fontSize: "12px", color: "#666" }}>Image</span>
                                    </div>

                                    {/* Product Info */}
                                    <div>
                                        <h3 style={{ margin: "0 0 5px 0" }}>{item.name}</h3>
                                        <p style={{ margin: "0", color: "#666", fontSize: "14px" }}>Trader: {item.trader?.name || 'Unknown'}</p>
                                        <p style={{ margin: "5px 0 0 0", color: "#ff7300", fontSize: "12px" }}>
                                            🌱 {item.carbonEmission}kg CO2 per unit
                                        </p>
                                    </div>

                                    {/* Price */}
                                    <div style={{ textAlign: "right" }}>
                                        <p style={{ margin: "0", fontWeight: "bold" }}>${item.price?.toFixed(2) || '0.00'}</p>
                                    </div>

                                    {/* Quantity */}
                                    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                        <button
                                            onClick={() => updateQuantity(item._id, (item.quantity || 1) - 1)}
                                            style={{ width: "25px", height: "25px", border: "1px solid #ddd", borderRadius: "3px", cursor: "pointer" }}
                                        >
                                            −
                                        </button>
                                        <input
                                            type="number"
                                            value={item.quantity || 1}
                                            onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
                                            min="1"
                                            style={{ width: "40px", textAlign: "center", border: "1px solid #ddd", borderRadius: "3px", padding: "5px" }}
                                        />
                                        <button
                                            onClick={() => updateQuantity(item._id, (item.quantity || 1) + 1)}
                                            style={{ width: "25px", height: "25px", border: "1px solid #ddd", borderRadius: "3px", cursor: "pointer" }}
                                        >
                                            +
                                        </button>
                                    </div>

                                    {/* Remove */}
                                    <button
                                        onClick={() => removeItem(item._id)}
                                        style={{
                                            padding: "8px 12px",
                                            backgroundColor: "#dc3545",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "5px",
                                            cursor: "pointer",
                                            fontSize: "14px"
                                        }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div style={{ height: "fit-content" }}>
                        <div style={{ backgroundColor: "#f8f9fa", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                            <h3>Order Summary</h3>
                            
                            <div style={{ marginBottom: "20px", paddingBottom: "20px", borderBottom: "1px solid #ddd" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                                    <span>Subtotal:</span>
                                    <span>${totalPrice.toFixed(2)}</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                                    <span>Tax (10%):</span>
                                    <span>${(totalPrice * 0.1).toFixed(2)}</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span>Shipping:</span>
                                    <span>Free</span>
                                </div>
                            </div>

                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", fontSize: "18px", fontWeight: "bold" }}>
                                <span>Total:</span>
                                <span>${(totalPrice * 1.1).toFixed(2)}</span>
                            </div>

                            {/* Environmental Impact */}
                            <div style={{ backgroundColor: "#e8f5e9", padding: "15px", borderRadius: "5px", marginBottom: "20px" }}>
                                <h4 style={{ margin: "0 0 10px 0", color: "#2e7d32" }}>🌍 Your Impact</h4>
                                <p style={{ margin: "0", fontSize: "14px", color: "#2e7d32" }}>
                                    Total CO2: <strong>{totalEmissions.toFixed(2)} kg</strong>
                                </p>
                                <p style={{ margin: "5px 0 0 0", fontSize: "12px", color: "#555" }}>
                                    You're choosing eco-friendly products!
                                </p>
                            </div>

                            <button
                                onClick={handleCheckout}
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    backgroundColor: "#4CAF50",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "5px",
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                    transition: "background-color 0.3s"
                                }}
                                onMouseOver={(e) => e.target.style.backgroundColor = "#45a049"}
                                onMouseOut={(e) => e.target.style.backgroundColor = "#4CAF50"}
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
