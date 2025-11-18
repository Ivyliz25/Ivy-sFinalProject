import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        quantity: '',
        unit: 'pieces',
        category: '',
        carbonEmission: '',
        image: '',
        imageFile: null
    });

    // Unit mappings for different categories
    const categoryUnits = {
        'Clothing': ['pieces', 'kg'],
        'Electronics': ['pieces', 'kg'],
        'Food & Beverages': ['kg', 'liters', 'pieces', 'grams'],
        'Home & Garden': ['pieces', 'kg', 'liters'],
        'Beauty & Personal Care': ['pieces', 'ml', 'grams'],
        'Sports & Outdoors': ['pieces', 'kg'],
        'Other': ['pieces', 'kg', 'liters', 'grams', 'ml']
    };

    const getUnitsForCategory = () => {
        return categoryUnits[formData.category] || ['pieces'];
    };

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data } = await api.get('/products/my-products');
            setProducts(data);
        } catch (err) {
            console.error('Error fetching products:', err);
        }
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        
        if (name === 'imageFile' && files && files[0]) {
            const file = files[0];
            setFormData(prev => ({
                ...prev,
                imageFile: file
            }));
            
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setFormData(prev => ({
                    ...prev,
                    image: reader.result
                }));
            };
            reader.readAsDataURL(file);
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        // Validation
        if (!formData.name || !formData.price || !formData.quantity || !formData.category || !formData.carbonEmission) {
            setError('Please fill in all required fields');
            setLoading(false);
            return;
        }

        if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
            setError('Price must be a valid positive number');
            setLoading(false);
            return;
        }

        if (isNaN(formData.quantity) || parseInt(formData.quantity) <= 0) {
            setError('Quantity must be a valid positive number');
            setLoading(false);
            return;
        }

        if (isNaN(formData.carbonEmission) || parseFloat(formData.carbonEmission) < 0) {
            setError('Carbon emission must be a valid non-negative number');
            setLoading(false);
            return;
        }

        try {
            const productData = {
                ...formData,
                price: parseFloat(formData.price),
                quantity: parseInt(formData.quantity),
                carbonEmission: parseFloat(formData.carbonEmission)
            };

            const response = await api.post('/products', productData);
            
            if (response.status === 201) {
                setSuccess('Product added successfully!');
                setFormData({
                    name: '',
                    description: '',
                    price: '',
                    quantity: '',
                    unit: 'pieces',
                    category: '',
                    carbonEmission: '',
                    image: '',
                    imageFile: null
                });
                setImagePreview(null);
                fetchProducts();
                setTimeout(() => setSuccess(''), 3000);
            }
        } catch (err) {
            console.error('Error adding product:', err);
            setError(err.response?.data?.message || 'Error adding product');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/products/${productId}`);
                setSuccess('Product deleted successfully!');
                fetchProducts();
                setTimeout(() => setSuccess(''), 3000);
            } catch (err) {
                setError('Error deleting product');
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        window.location.href = "/";
    };

    return (
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                <h1>Add Products</h1>
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

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
                {/* Add Product Form */}
                <div>
                    <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                        <h2>Add New Product</h2>
                        
                        {error && <div style={{ padding: "15px", backgroundColor: "#f8d7da", color: "#721c24", borderRadius: "5px", marginBottom: "20px" }}>{error}</div>}
                        {success && <div style={{ padding: "15px", backgroundColor: "#d4edda", color: "#155724", borderRadius: "5px", marginBottom: "20px" }}>{success}</div>}

                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: "15px" }}>
                                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Product Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g., Organic Cotton T-Shirt"
                                    style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "5px", boxSizing: "border-box" }}
                                    required
                                />
                            </div>

                            <div style={{ marginBottom: "15px" }}>
                                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Describe your product..."
                                    rows="3"
                                    style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "5px", boxSizing: "border-box", fontFamily: "Arial" }}
                                />
                            </div>

                            <div style={{ marginBottom: "15px" }}>
                                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Category *</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "5px", boxSizing: "border-box" }}
                                    required
                                >
                                    <option value="">Select a category</option>
                                    <option value="Clothing">Clothing</option>
                                    <option value="Electronics">Electronics</option>
                                    <option value="Food & Beverages">Food & Beverages</option>
                                    <option value="Home & Garden">Home & Garden</option>
                                    <option value="Beauty & Personal Care">Beauty & Personal Care</option>
                                    <option value="Sports & Outdoors">Sports & Outdoors</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div style={{ marginBottom: "15px" }}>
                                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Price (USD) *</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                    style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "5px", boxSizing: "border-box" }}
                                    required
                                />
                            </div>

                            <div style={{ marginBottom: "15px", display: "grid", gridTemplateColumns: "2fr 1fr", gap: "10px" }}>
                                <div>
                                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Quantity *</label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={formData.quantity}
                                        onChange={handleChange}
                                        placeholder="0"
                                        min="0"
                                        step="0.01"
                                        style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "5px", boxSizing: "border-box" }}
                                        required
                                    />
                                </div>
                                <div>
                                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Unit *</label>
                                    <select
                                        name="unit"
                                        value={formData.unit}
                                        onChange={handleChange}
                                        style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "5px", boxSizing: "border-box" }}
                                        required
                                    >
                                        {getUnitsForCategory().map(unitOption => (
                                            <option key={unitOption} value={unitOption}>{unitOption}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div style={{ marginBottom: "15px" }}>
                                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Carbon Emission (kg CO2) *</label>
                                <input
                                    type="number"
                                    name="carbonEmission"
                                    value={formData.carbonEmission}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                    style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "5px", boxSizing: "border-box" }}
                                    required
                                />
                            </div>

                            <div style={{ marginBottom: "20px" }}>
                                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Image URL</label>
                                <input
                                    type="text"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleChange}
                                    placeholder="https://example.com/image.jpg"
                                    style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "5px", boxSizing: "border-box" }}
                                />
                            </div>

                            <div style={{ marginBottom: "20px" }}>
                                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Or Upload Image from Local Storage</label>
                                <input
                                    type="file"
                                    name="imageFile"
                                    accept="image/*"
                                    onChange={handleChange}
                                    style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "5px", boxSizing: "border-box" }}
                                />
                                {imagePreview && (
                                    <div style={{ marginTop: "15px" }}>
                                        <p style={{ marginBottom: "10px", fontWeight: "bold" }}>Image Preview:</p>
                                        <img 
                                            src={imagePreview} 
                                            alt="Preview" 
                                            style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: "5px", border: "1px solid #ddd" }}
                                        />
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    backgroundColor: loading ? "#ccc" : "#4CAF50",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "5px",
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                    cursor: loading ? "not-allowed" : "pointer"
                                }}
                            >
                                {loading ? "Adding..." : "Add Product"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* My Products List */}
                <div>
                    <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                        <h2>My Products ({products.length})</h2>
                        
                        {products.length === 0 ? (
                            <p style={{ color: "#666", textAlign: "center", padding: "20px" }}>No products added yet</p>
                        ) : (
                            <div style={{ maxHeight: "600px", overflowY: "auto" }}>
                                {products.map((product) => (
                                    <div
                                        key={product._id}
                                        style={{
                                            padding: "15px",
                                            borderBottom: "1px solid #eee",
                                            marginBottom: "10px"
                                        }}
                                    >
                                        <div style={{ display: "flex", gap: "12px", justifyContent: "space-between", alignItems: "start" }}>
                                            {product.image && (
                                                <img 
                                                    src={product.image} 
                                                    alt={product.name}
                                                    style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "5px", flexShrink: 0 }}
                                                />
                                            )}
                                            <div style={{ flex: 1 }}>
                                                <h4 style={{ margin: "0 0 5px 0" }}>{product.name}</h4>
                                                <p style={{ margin: "0 0 5px 0", fontSize: "14px", color: "#666" }}>
                                                    Category: {product.category}
                                                </p>
                                                <p style={{ margin: "0 0 5px 0", fontSize: "14px", color: "#666" }}>
                                                    Price: <strong>${product.price?.toFixed(2) || '0.00'}</strong>
                                                </p>
                                                <p style={{ margin: "0 0 5px 0", fontSize: "14px", color: "#666" }}>
                                                    Quantity: <strong>{product.quantity || 0} {product.unit || 'pieces'}</strong>
                                                </p>
                                                <p style={{ margin: "0", fontSize: "14px", color: "#ff7300" }}>
                                                    🌱 {product.carbonEmission || 0}kg CO2
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteProduct(product._id)}
                                                style={{
                                                    padding: "8px 12px",
                                                    backgroundColor: "#dc3545",
                                                    color: "white",
                                                    border: "none",
                                                    borderRadius: "5px",
                                                    cursor: "pointer",
                                                    fontSize: "12px",
                                                    whiteSpace: "nowrap",
                                                    flexShrink: 0
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;
