import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import ProductCard from '../components/ProductCard.jsx';
import EmissionBadge from '../components/EmissionBadge.jsx';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

const Inspect = () => {
    const { id } = useParams(); // trader ID from URL
    const navigate = useNavigate();
    const [trader, setTrader] = useState(null);
    const [products, setProducts] = useState([]);
    const [emissions, setEmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTraderData = async () => {
            try {
                setLoading(true);
                // Fetch trader details from public endpoint
                const { data: traderData } = await api.get(`/traders/${id}/public`);
                setTrader(traderData);

                // Fetch trader's products
                const { data: productData } = await api.get('/products');
                const traderProducts = productData.filter(p => p.trader._id === id || p.trader === id);
                setProducts(traderProducts);

                // Fetch analytics (emissions) - if available
                try {
                    const { data: emissionData } = await api.get('/analytics');
                    const traderEmissions = emissionData.filter(e => e.trader === id);
                    setEmissions(traderEmissions);
                } catch (err) {
                    console.log('Analytics not available');
                }
            } catch (error) {
                console.error('Error fetching trader data:', error);
                setError('Failed to load trader information. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchTraderData();
    }, [id]);

    if (loading) return <div className="container" style={{ padding: '20px', textAlign: 'center' }}><p>Loading trader information...</p></div>;
    if (error) return <div className="container" style={{ padding: '20px', color: '#d32f2f' }}><p>{error}</p><button onClick={() => navigate('/inspect')} style={{ padding: '10px 20px', backgroundColor: '#2d6a4f', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Back to Traders</button></div>;
    if (!trader) return <div className="container" style={{ padding: '20px', color: '#d32f2f' }}><p>Trader not found.</p><button onClick={() => navigate('/inspect')} style={{ padding: '10px 20px', backgroundColor: '#2d6a4f', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Back to Traders</button></div>;

    return (
        <div className="container" style={{ padding: '20px' }}>
            <button onClick={() => navigate('/inspect')} style={{ padding: '8px 16px', marginBottom: '20px', backgroundColor: '#666', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>← Back to Traders</button>
            
            {/* Trader Profile Section */}
            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
                <h1 style={{ margin: '0 0 10px 0' }}>{trader.name}</h1>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div>
                        <p><strong>📧 Email:</strong> {trader.email || 'N/A'}</p>
                        <p><strong>⭐ Rating:</strong> {trader.rating ? `${trader.rating.toFixed(1)}/5` : 'No rating yet'}</p>
                        <p><strong>📍 Location:</strong> {trader.location || 'Not specified'}</p>
                    </div>
                    <div>
                        <p><strong>📦 Total Products:</strong> {trader.productCount || products.length}</p>
                        <p><strong>🏪 Role:</strong> {trader.role || 'Trader'}</p>
                        <p><strong>📅 Joined:</strong> {new Date(trader.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>

                {trader.bio && (
                    <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '6px', borderLeft: '4px solid #2d6a4f' }}>
                        <p><strong>📝 About:</strong></p>
                        <p>{trader.bio}</p>
                    </div>
                )}
            </div>

            {/* Products Section */}
            <section style={{ marginBottom: '30px' }}>
                <h2>Products ({products.length})</h2>
                {products.length === 0 ? (
                    <p style={{ color: '#666' }}>No products available from this trader.</p>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                        {products.map(p => <ProductCard key={p._id} product={p} />)}
                    </div>
                )}
            </section>

            {/* Emissions Section */}
            {emissions.length > 0 && (
                <section style={{ marginTop: '30px', backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    <h2>Carbon Emissions</h2>
                    <LineChart width={700} height={300} data={emissions}>
                        <CartesianGrid stroke="#ccc" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="emissionKg" stroke="#8884d8" />
                    </LineChart>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px', marginTop: '20px' }}>
                        {emissions.slice(0, 5).map(e => (
                            <EmissionBadge key={e._id} emission={e.emissionKg} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default Inspect;
