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
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        bio: '',
        location: '',
        rating: 5
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const { data: traderData } = await api.get('/traders/profile');
                setTrader(traderData);
                setFormData({
                    bio: traderData.bio || '',
                    location: traderData.location || '',
                    rating: traderData.rating || 5
                });

                const { data: productData } = await api.get('/products/my-products');
                setProducts(productData || []);
            } catch (err) {
                console.error(err);
                setError('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
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
            setSaving(true);
            const { data } = await api.put('/traders/profile', formData);
            setTrader(data);
            setSuccess('Profile updated successfully!');
            setIsEditing(false);
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        if (trader) {
            setFormData({
                bio: trader.bio || '',
                location: trader.location || '',
                rating: trader.rating || 5
            });
        }
        setIsEditing(false);
        setError('');
        setSuccess('');
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        window.location.href = "/";
    };

    if (loading) return <p style={{ textAlign: 'center', padding: '20px' }}>Loading profile...</p>;
    if (!trader) return <p style={{ color: 'red', textAlign: 'center', padding: '20px' }}>Failed to load profile</p>;

    return (
        <div className="container" style={{ padding: '20px' }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px" }}>
                <h1>My Trader Profile</h1>
                <div>
                    <button onClick={() => navigate('/trader-dashboard')}>Back to Dashboard</button>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px', marginBottom: '30px' }}>
                {/* Profile Info */}
                <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px' }}>
                    <h2>{trader.name}</h2>
                    <p>{trader.role}</p>
                    <p>⭐ {trader.rating?.toFixed(1) || 'N/A'}/5</p>
                    <p>Email: {trader.email}</p>
                    <p>Location: {trader.location || 'Not specified'}</p>
                    <p>Joined: {new Date(trader.createdAt).toLocaleDateString()}</p>
                    <button onClick={() => setIsEditing(true)}>Edit Profile</button>
                </div>

                {/* Edit Form */}
                <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px' }}>
                    {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
                    {success && <div style={{ color: 'green', marginBottom: '10px' }}>{success}</div>}

                    {isEditing && (
                        <>
                            <label>Bio</label>
                            <textarea name="bio" value={formData.bio} onChange={handleChange} rows="4" />

                            <label>Location</label>
                            <input type="text" name="location" value={formData.location} onChange={handleChange} />

                            <label>Rating</label>
                            <input type="number" name="rating" value={formData.rating} onChange={handleChange} min="1" max="5" step="0.5" />

                            <button onClick={handleSaveProfile} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
                            <button onClick={handleCancel}>Cancel</button>
                        </>
                    )}

                    {!isEditing && (
                        <>
                            <h3>About Me</h3>
                            <p>{trader.bio || 'No bio yet.'}</p>
                        </>
                    )}
                </div>
            </div>

            {/* Products Section */}
            <section>
                <h2>My Products ({products.length})</h2>
                {products.length === 0 ? (
                    <p>You haven't added any products yet.</p>
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
