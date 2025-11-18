import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { FaSearch, FaUsers, FaEye, FaEnvelope } from 'react-icons/fa';

const InspectList = () => {
    const [traders, setTraders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchTraders = async () => {
            try {
                const { data } = await api.get('/traders');
                setTraders(data);
            } catch (err) {
                console.error('Error fetching traders:', err);
                setError(err.response?.data?.message || 'Unable to load traders');
            } finally {
                setLoading(false);
            }
        };

        fetchTraders();
    }, []);

    // Filter traders based on search
    const filteredTraders = traders.filter(trader =>
        trader.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trader.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="container" style={{ textAlign: 'center', padding: '40px' }}>
            <div className="loading-spinner" style={{
                width: '50px',
                height: '50px',
                border: '5px solid #f3f3f3',
                borderTop: '5px solid #2d6a4f',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 20px'
            }}></div>
            <h2 style={{ color: '#2d6a4f', margin: 0 }}>Loading Traders...</h2>
        </div>
    );

    return (
        <div className="container" style={{ 
            padding: '20px', 
            maxWidth: '1200px',
            margin: '0 auto'
        }}>
            {/* Header Section */}
            <div style={{ 
                background: 'linear-gradient(135deg, #2d6a4f 0%, #40916c 100%)',
                color: 'white',
                padding: '30px',
                borderRadius: '12px',
                marginBottom: '30px',
                textAlign: 'center'
            }}>
                <h1 style={{ 
                    margin: '0 0 10px 0',
                    fontSize: '2.5rem',
                    fontWeight: '700'
                }}>Trader Inspection</h1>
                <p style={{ 
                    margin: 0,
                    fontSize: '1.1rem',
                    opacity: 0.9
                }}>Manage and review all registered traders</p>
            </div>

            {/* Stats Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px',
                marginBottom: '30px'
            }}>
                <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '10px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    textAlign: 'center'
                }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#2d6a4f' }}>Total Traders</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#1b4332' }}>
                        {traders.length}
                    </p>
                </div>
                <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '10px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    textAlign: 'center'
                }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#2d6a4f' }}>Displayed</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#1b4332' }}>
                        {filteredTraders.length}
                    </p>
                </div>
            </div>

            {/* Search and Controls */}
            <div style={{
                background: 'white',
                padding: '20px',
                borderRadius: '10px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                marginBottom: '20px'
            }}>
                <div style={{
                    display: 'flex',
                    gap: '15px',
                    alignItems: 'center',
                    flexWrap: 'wrap'
                }}>
                    <div style={{ flex: '1', minWidth: '300px' }}>
                        <input
                            type="text"
                            placeholder="Search traders by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '2px solid #e9ecef',
                                borderRadius: '8px',
                                fontSize: '16px',
                                outline: 'none',
                                transition: 'border-color 0.3s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#2d6a4f'}
                            onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                        />
                    </div>
                    <button
                        onClick={() => setSearchTerm('')}
                        style={{
                            padding: '12px 20px',
                            background: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600'
                        }}
                    >
                        Clear Search
                    </button>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div style={{
                    background: '#f8d7da',
                    color: '#721c24',
                    padding: '15px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    border: '1px solid #f5c6cb'
                }}>
                    {error}
                </div>
            )}

            {/* Traders List */}
            {filteredTraders.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '40px',
                    background: 'white',
                    borderRadius: '10px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}>
                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔍</div>
                    <h3 style={{ color: '#6c757d', marginBottom: '10px' }}>
                        {searchTerm ? 'No traders found' : 'No traders available'}
                    </h3>
                    <p style={{ color: '#6c757d' }}>
                        {searchTerm ? 'Try adjusting your search terms' : 'Traders will appear here once registered'}
                    </p>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gap: '15px'
                }}>
                    {filteredTraders.map(trader => (
                        <div key={trader._id} style={{
                            background: 'white',
                            padding: '20px',
                            borderRadius: '10px',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            borderLeft: '4px solid #2d6a4f'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                        }}
                        >
                            <div style={{ flex: 1 }}>
                                <h3 style={{ 
                                    margin: '0 0 8px 0',
                                    color: '#1b4332',
                                    fontSize: '1.3rem'
                                }}>
                                    {trader.name}
                                </h3>
                                <p style={{ 
                                    margin: '0 0 5px 0', 
                                    color: '#6c757d',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}>
                                    📧 {trader.email}
                                </p>
                                {trader.status && (
                                    <span style={{
                                        display: 'inline-block',
                                        padding: '4px 12px',
                                        background: trader.status === 'active' ? '#d4edda' : '#fff3cd',
                                        color: trader.status === 'active' ? '#155724' : '#856404',
                                        borderRadius: '20px',
                                        fontSize: '0.85rem',
                                        fontWeight: '600',
                                        marginTop: '8px'
                                    }}>
                                        {trader.status}
                                    </span>
                                )}
                            </div>
                            <Link to={`/inspect/${trader._id}`} style={{ textDecoration: 'none' }}>
                                <button style={{
                                    padding: '10px 20px',
                                    background: 'linear-gradient(135deg, #2d6a4f 0%, #40916c 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    fontSize: '14px',
                                    transition: 'all 0.3s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'scale(1.05)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(45, 106, 79, 0.3)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                                >
                                    Inspect Trader →
                                </button>
                            </Link>
                        </div>
                    ))}
                </div>
            )}

            {}
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

export default InspectList;