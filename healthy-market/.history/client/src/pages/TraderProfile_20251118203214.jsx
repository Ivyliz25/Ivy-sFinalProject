import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import ProductCard from '../components/ProductCard.jsx';

const TraderProfile = () => {
    const navigate = useNavigate();
    const [trader, setTrader] = useState(null);
    const [products, setProducts] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        bio: '',
        location: '',
        rating: 5
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchTraderData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                // Get current user's trader profile
                const { data: traderData } = await api.get('/traders/profile');
                setTrader(traderData);
                setFormData({
                    bio: traderData.bio || '',
                    location: traderData.location || '',
                    rating: traderData.rating || 5
                });

                // Get trader's products
                const { data: productData } = await api.get('/products/my-products');
                setProducts(productData || []);
            } catch (error) {
                console.error('Error fetching trader data:', error);
                setError('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        fetchTraderData();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'rating' ? parseFloat(value) : value
        }));
    };

    const handleSaveProfile = async () => {
        try {
            setError('');
            setSuccess('');
            await api.put('/traders/profile', formData);
            setTrader(prev => ({
                ...prev,
                ...formData
            }));
            setSuccess('Profile updated successfully!');
            setIsEditing(false);
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            console.error('Error updating profile:', error);
            setError(error.response?.data?.message || 'Failed to update profile');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        window.location.href = "/";
    };

    if (loading) {
        return <div className="container" style={{ padding: '20px', textAlign: 'center' }}><p>Loading profile...</p></div>;
    }

    if (!trader) {
        return <div className="container" style={{ padding: '20px', color: '#d32f2f' }}><p>Failed to load profile</p></div>;
    }

    return (
        <div className="container" style={{ padding: '20px' }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                <h1>My Trader Profile</h1>
                <div>
                    <button
                        onClick={() => navigate('/trader-dashboard')}
                        style={{ padding: "10px 20px", marginRight: "10px", backgroundColor: "#0066cc", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
                    >
                        Back to Dashboard
                    </button>
                    <button
                        onClick={handleLogout}
                        style={{ padding: "10px 20px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Profile Card */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px', marginBottom: '30px' }}>
                {/* Profile Info */}
                <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', height: 'fit-content' }}>
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <div style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            backgroundColor: '#2d6a4f',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '48px',
                            margin: '0 auto 15px',
                            fontWeight: 'bold'
                        }}>
                            {trader.name.charAt(0).toUpperCase()}
                        </div>
                        <h2 style={{ margin: '0 0 5px 0' }}>{trader.name}</h2>
                        <p style={{ margin: '0 0 10px 0', color: '#666' }}>👤 {trader.role}</p>
                        <p style={{ margin: '0', color: '#2d6a4f', fontWeight: 'bold' }}>⭐ {trader.rating?.toFixed(1) || 'N/A'}/5</p>
                    </div>

                    <hr style={{ margin: '20px 0', borderColor: '#eee' }} />

                    <div style={{ marginBottom: '15px' }}>
                        <p><strong>Email:</strong></p>
                        <p style={{ color: '#666', wordBreak: 'break-all' }}>{trader.email}</p>
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <p><strong>📍 Location:</strong></p>
                        <p style={{ color: '#666' }}>{trader.location || 'Not specified'}</p>
                    </div>

                    <div>
                        <p><strong>📅 Joined:</strong></p>
                        <p style={{ color: '#666' }}>{new Date(trader.createdAt).toLocaleDateString()}</p>
                    </div>

                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        style={{
                            width: '100%',
                            marginTop: '20px',
                            padding: '12px',
                            backgroundColor: isEditing ? '#6c757d' : '#2d6a4f',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                    </button>
                </div>

                {/* Edit Profile Form or Bio Display */}
                <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    {error && <div style={{ padding: "15px", backgroundColor: "#f8d7da", color: "#721c24", borderRadius: "5px", marginBottom: "20px" }}>{error}</div>}
                    {success && <div style={{ padding: "15px", backgroundColor: "#d4edda", color: "#155724", borderRadius: "5px", marginBottom: "20px" }}>{success}</div>}

                    {isEditing ? (
                        <>
                            <h3>Edit Your Public Profile</h3>
                            <p style={{ color: '#666', fontSize: '0.9rem' }}>This information will be visible to customers when they view your trader page.</p>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Bio</label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    placeholder="Tell customers about your business and products..."
                                    rows="4"
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #ddd',
                                        borderRadius: '5px',
                                        boxSizing: 'border-box',
                                        fontFamily: 'Arial',
                                        resize: 'vertical'
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="e.g., New York, USA"
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #ddd',
                                        borderRadius: '5px',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Rating</label>
                                <input
                                    type="number"
                                    name="rating"
                                    value={formData.rating}
                                    onChange={handleChange}
                                    min="1"
                                    max="5"
                                    step="0.5"
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #ddd',
                                        borderRadius: '5px',
                                        boxSizing: 'border-box'
                                    }}
                                />
                                <p style={{ color: '#999', fontSize: '0.9rem', marginTop: '5px' }}>Rating from 1 to 5 stars</p>
                            </div>

                            <button
                                onClick={handleSaveProfile}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    backgroundColor: '#28a745',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold'
                                }}
                            >
                                Save Profile
                            </button>
                        </>
                    ) : (
                        <>
                            <h3>About Me</h3>
                            {trader.bio ? (
                                <p style={{ color: '#666', lineHeight: '1.6' }}>{trader.bio}</p>
                            ) : (
                                <p style={{ color: '#999', fontStyle: 'italic' }}>No bio yet. Click "Edit Profile" to add one.</p>
                            )}

                            <hr style={{ margin: '20px 0', borderColor: '#eee' }} />

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '6px', textAlign: 'center' }}>
                                    <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '0.9rem' }}>Total Products</p>
                                    <h3 style={{ margin: 0, color: '#2d6a4f' }}>{products.length}</h3>
                                </div>
                                <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '6px', textAlign: 'center' }}>
                                    <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '0.9rem' }}>Total Revenue</p>
                                    <h3 style={{ margin: 0, color: '#2d6a4f' }}>$0.00</h3>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Products Section */}
            <section>
                <h2>My Products ({products.length})</h2>
                {products.length === 0 ? (
                    <p style={{ color: '#666', textAlign: 'center', padding: '40px' }}>You haven't added any products yet.</p>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                        {products.map(p => <ProductCard key={p._id} product={p} />)}
                    </div>
                )}
            </section>
        </div>
    );
};

export default TraderProfile;
