import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalEmissions, setTotalEmissions] = useState(0);
    const [showCheckout, setShowCheckout] = useState(false);
    const [processingPayment, setProcessingPayment] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    // Payment form state
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [cardDetails, setCardDetails] = useState({
        number: '',
        expiry: '',
        cvv: '',
        name: ''
    });
    const [customerInfo, setCustomerInfo] = useState({
        email: '',
        address: '',
        city: '',
        zipCode: '',
        country: ''
    });

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

    const handleCheckoutClick = () => {
        if (cartItems.length === 0) {
            alert('Cart is empty');
            return;
        }
        setShowCheckout(true);
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        setProcessingPayment(true);

        try {
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 2000));

            const orderData = {
                items: cartItems,
                totalPrice: totalPrice * 1.1, // Including tax
                totalEmissions,
                customerInfo,
                paymentMethod,
                orderDate: new Date(),
                status: 'completed'
            };

            // Send order to backend
            const response = await api.post('/api/orders', orderData);
            
            if (response.status === 201) {
                setPaymentSuccess(true);
                localStorage.removeItem('cart');
                setCartItems([]);
                
                // Reset form
                setTimeout(() => {
                    setShowCheckout(false);
                    setPaymentSuccess(false);
                    navigate('/customer-dashboard');
                }, 3000);
            }
        } catch (err) {
            console.error('Payment error:', err);
            alert('Payment failed: ' + (err.response?.data?.message || err.message));
        } finally {
            setProcessingPayment(false);
        }
    };

    const handleInputChange = (setter) => (e) => {
        const { name, value } = e.target;
        setter(prev => ({ ...prev, [name]: value }));
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("cart");
        window.location.href = "/";
    };

    const taxAmount = totalPrice * 0.1;
    const finalTotal = totalPrice + taxAmount;

    if (paymentSuccess) {
        return (
            <div className="container" style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
                <div style={{ background: '#e8f5e8', padding: '40px', borderRadius: '12px', border: '2px solid #4CAF50' }}>
                    <div style={{ fontSize: '60px', color: '#4CAF50', marginBottom: '20px' }}>✅</div>
                    <h2 style={{ color: '#2e7d32', marginBottom: '15px' }}>Payment Successful!</h2>
                    <p style={{ fontSize: '18px', color: '#555', marginBottom: '10px' }}>
                        Thank you for your order!
                    </p>
                    <p style={{ color: '#666', marginBottom: '25px' }}>
                        Order Total: <strong>${finalTotal.toFixed(2)}</strong>
                    </p>
                    <p style={{ color: '#666', fontSize: '14px' }}>
                        A confirmation email has been sent to {customerInfo.email}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
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
                <div style={{ display: "grid", gridTemplateColumns: showCheckout ? "1fr 400px" : "1fr 300px", gap: "30px" }}>
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
                                    {item.image ? (
                                        <img 
                                            src={item.image} 
                                            alt={item.name}
                                            style={{ 
                                                width: '80px', 
                                                height: '80px', 
                                                objectFit: 'cover', 
                                                borderRadius: '8px'
                                            }}
                                        />
                                    ) : (
                                        <div style={{ backgroundColor: "#f0f0f0", borderRadius: "8px", height: "80px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <span style={{ fontSize: "12px", color: "#666" }}>No Image</span>
                                        </div>
                                    )}

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

                    {/* Order Summary & Checkout */}
                    <div style={{ height: "fit-content" }}>
                        {!showCheckout ? (
                            // Order Summary
                            <div style={{ backgroundColor: "#f8f9fa", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                                <h3>Order Summary</h3>
                                
                                <div style={{ marginBottom: "20px", paddingBottom: "20px", borderBottom: "1px solid #ddd" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                                        <span>Subtotal:</span>
                                        <span>${totalPrice.toFixed(2)}</span>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                                        <span>Tax (10%):</span>
                                        <span>${taxAmount.toFixed(2)}</span>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <span>Shipping:</span>
                                        <span>Free</span>
                                    </div>
                                </div>

                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", fontSize: "18px", fontWeight: "bold" }}>
                                    <span>Total:</span>
                                    <span>${finalTotal.toFixed(2)}</span>
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
                                    onClick={handleCheckoutClick}
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
                        ) : (
                            // Checkout Form
                            <div style={{ backgroundColor: "white", padding: "25px", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                                <h3 style={{ marginBottom: "20px", color: "#333" }}>Checkout</h3>
                                
                                <form onSubmit={handlePaymentSubmit}>
                                    {/* Customer Information */}
                                    <div style={{ marginBottom: "25px" }}>
                                        <h4 style={{ marginBottom: "15px", color: "#555" }}>Customer Information</h4>
                                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="Email Address"
                                                value={customerInfo.email}
                                                onChange={handleInputChange(setCustomerInfo)}
                                                required
                                                style={{ padding: "12px", border: "1px solid #ddd", borderRadius: "5px", fontSize: "14px" }}
                                            />
                                            <input
                                                type="text"
                                                name="address"
                                                placeholder="Shipping Address"
                                                value={customerInfo.address}
                                                onChange={handleInputChange(setCustomerInfo)}
                                                required
                                                style={{ padding: "12px", border: "1px solid #ddd", borderRadius: "5px", fontSize: "14px" }}
                                            />
                                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                                                <input
                                                    type="text"
                                                    name="city"
                                                    placeholder="City"
                                                    value={customerInfo.city}
                                                    onChange={handleInputChange(setCustomerInfo)}
                                                    required
                                                    style={{ padding: "12px", border: "1px solid #ddd", borderRadius: "5px", fontSize: "14px" }}
                                                />
                                                <input
                                                    type="text"
                                                    name="zipCode"
                                                    placeholder="ZIP Code"
                                                    value={customerInfo.zipCode}
                                                    onChange={handleInputChange(setCustomerInfo)}
                                                    required
                                                    style={{ padding: "12px", border: "1px solid #ddd", borderRadius: "5px", fontSize: "14px" }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment Method */}
                                    <div style={{ marginBottom: "25px" }}>
                                        <h4 style={{ marginBottom: "15px", color: "#555" }}>Payment Method</h4>
                                        <div style={{ display: "flex", gap: "15px", marginBottom: "15px" }}>
                                            {['card', 'paypal'].map(method => (
                                                <label key={method} style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                                                    <input
                                                        type="radio"
                                                        value={method}
                                                        checked={paymentMethod === method}
                                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                                        style={{ cursor: 'pointer' }}
                                                    />
                                                    {method === 'card' ? '💳 Credit Card' : '🔵 PayPal'}
                                                </label>
                                            ))}
                                        </div>

                                        {paymentMethod === 'card' && (
                                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                                <input
                                                    type="text"
                                                    name="number"
                                                    placeholder="Card Number"
                                                    value={cardDetails.number}
                                                    onChange={handleInputChange(setCardDetails)}
                                                    required
                                                    style={{ padding: "12px", border: "1px solid #ddd", borderRadius: "5px", fontSize: "14px" }}
                                                />
                                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                                                    <input
                                                        type="text"
                                                        name="expiry"
                                                        placeholder="MM/YY"
                                                        value={cardDetails.expiry}
                                                        onChange={handleInputChange(setCardDetails)}
                                                        required
                                                        style={{ padding: "12px", border: "1px solid #ddd", borderRadius: "5px", fontSize: "14px" }}
                                                    />
                                                    <input
                                                        type="text"
                                                        name="cvv"
                                                        placeholder="CVV"
                                                        value={cardDetails.cvv}
                                                        onChange={handleInputChange(setCardDetails)}
                                                        required
                                                        style={{ padding: "12px", border: "1px solid #ddd", borderRadius: "5px", fontSize: "14px" }}
                                                    />
                                                </div>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    placeholder="Cardholder Name"
                                                    value={cardDetails.name}
                                                    onChange={handleInputChange(setCardDetails)}
                                                    required
                                                    style={{ padding: "12px", border: "1px solid #ddd", borderRadius: "5px", fontSize: "14px" }}
                                                />
                                            </div>
                                        )}

                                        {paymentMethod === 'paypal' && (
                                            <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '5px', textAlign: 'center' }}>
                                                <p style={{ margin: 0, color: '#666' }}>
                                                    You will be redirected to PayPal to complete your payment.
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Order Summary in Checkout */}
                                    <div style={{ backgroundColor: "#f8f9fa", padding: "15px", borderRadius: "5px", marginBottom: "20px" }}>
                                        <h5 style={{ margin: "0 0 10px 0" }}>Order Summary</h5>
                                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                                            <span>Items ({cartItems.length}):</span>
                                            <span>${totalPrice.toFixed(2)}</span>
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                                            <span>Tax:</span>
                                            <span>${taxAmount.toFixed(2)}</span>
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", marginTop: "8px", borderTop: "1px solid #ddd", paddingTop: "8px" }}>
                                            <span>Total:</span>
                                            <span>${finalTotal.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processingPayment}
                                        style={{
                                            width: "100%",
                                            padding: "15px",
                                            backgroundColor: processingPayment ? "#6c757d" : "#4CAF50",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "5px",
                                            fontSize: "16px",
                                            fontWeight: "bold",
                                            cursor: processingPayment ? "not-allowed" : "pointer",
                                            transition: "background-color 0.3s"
                                        }}
                                    >
                                        {processingPayment ? (
                                            <>
                                                <div style={{ 
                                                    display: 'inline-block',
                                                    width: '16px',
                                                    height: '16px',
                                                    border: '2px solid transparent',
                                                    borderTop: '2px solid white',
                                                    borderRadius: '50%',
                                                    animation: 'spin 1s linear infinite',
                                                    marginRight: '8px'
                                                }}></div>
                                                Processing Payment...
                                            </>
                                        ) : (
                                            `Pay $${finalTotal.toFixed(2)}`
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setShowCheckout(false)}
                                        style={{
                                            width: "100%",
                                            padding: "10px",
                                            backgroundColor: "transparent",
                                            color: "#666",
                                            border: "1px solid #ddd",
                                            borderRadius: "5px",
                                            marginTop: "10px",
                                            cursor: "pointer"
                                        }}
                                    >
                                        Back to Cart
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <style>
                {`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                `}
            </style>
        </div>
    );
};

export default Cart;