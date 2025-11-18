import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaFilter, FaSort, FaLeaf, FaUser, FaPlus, FaMinus } from 'react-icons/fa';

const ProductsAvailable = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('none');
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/products');
        setProducts(data || []);
        const cats = Array.from(new Set((data || []).map(p => p.category || 'Other'))).sort();
        setCategories(['All', ...cats]);
      } catch (err) {
        console.error('Error loading products:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Cart functions
  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item._id === product._id);
      
      if (existingItem) {
        // Increase quantity if item already in cart
        return prevCart.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new item to cart
        return [...prevCart, {
          ...product,
          quantity: 1,
          cartId: Date.now() // Unique ID for cart item
        }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item._id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item._id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const filtered = products.filter(p => 
    activeCategory === 'All' ? true : (p.category || 'Other') === activeCategory
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price-asc') return (a.price || 0) - (b.price || 0);
    if (sortBy === 'price-desc') return (b.price || 0) - (a.price || 0);
    if (sortBy === 'emission-asc') return (a.carbonEmission || 0) - (b.carbonEmission || 0);
    if (sortBy === 'emission-desc') return (b.carbonEmission || 0) - (a.carbonEmission || 0);
    return 0;
  });

  const getTraderName = (product) => {
    if (product.trader) {
      if (typeof product.trader === 'object' && product.trader.name) {
        return product.trader.name;
      }
      if (typeof product.trader === 'string') {
        return 'Trader';
      }
    }
    return 'Unknown Trader';
  };

  const getTraderId = (product) => {
    if (product.trader) {
      if (typeof product.trader === 'object' && product.trader._id) {
        return product.trader._id;
      }
      if (typeof product.trader === 'string') {
        return product.trader;
      }
    }
    return null;
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '40px', textAlign: 'center' }}>
        <div className="loading-spinner" style={{
          width: '50px',
          height: '50px',
          border: '5px solid #f3f3f3',
          borderTop: '5px solid #2d6a4f',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 20px'
        }}></div>
        <h3 style={{ color: '#2d6a4f' }}>Loading Products...</h3>
      </div>
    );
  }

  return (
    <div className="container" style={{ position: 'relative', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header with Cart */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px',
        padding: '20px 0',
        borderBottom: '1px solid #e9ecef'
      }}>
        <div>
          <h1 style={{ 
            margin: 0, 
            color: '#1b4332',
            fontSize: '2.5rem',
            fontWeight: '700'
          }}>Market Products</h1>
          <p style={{ margin: '5px 0 0 0', color: '#6c757d' }}>
            Discover fresh, sustainable products from local traders
          </p>
        </div>
        
        <button
          onClick={() => setShowCart(!showCart)}
          style={{
            position: 'relative',
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #2d6a4f 0%, #40916c 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '16px'
          }}
        >
          <FaShoppingCart />
          Cart ({getCartItemCount()})
          {getCartItemCount() > 0 && (
            <span style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              background: '#e5383b',
              color: 'white',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold'
            }}>
              {getCartItemCount()}
            </span>
          )}
        </button>
      </div>

      <div style={{ display: 'flex', gap: '30px', marginTop: '20px' }}>
        {/* Sidebar */}
        <aside style={{ width: '280px', flexShrink: 0 }}>
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 2px 15px rgba(0,0,0,0.1)',
            marginBottom: '20px'
          }}>
            <h3 style={{ 
              margin: '0 0 15px 0', 
              color: '#1b4332',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <FaFilter /> Categories
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {categories.map(c => (
                <button 
                  key={c}
                  onClick={() => setActiveCategory(c)}
                  style={{
                    background: activeCategory === c ? '#2d6a4f' : 'transparent',
                    color: activeCategory === c ? '#fff' : '#495057',
                    border: 'none',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontWeight: activeCategory === c ? '600' : '400',
                    transition: 'all 0.2s'
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 2px 15px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ 
              margin: '0 0 15px 0', 
              color: '#1b4332',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <FaSort /> Sort By
            </h3>
            <select 
              value={sortBy} 
              onChange={e => setSortBy(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '2px solid #e9ecef',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#2d6a4f'}
              onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
            >
              <option value="none">Featured</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="emission-asc">Emissions: Low → High</option>
              <option value="emission-desc">Emissions: High → Low</option>
            </select>
          </div>
        </aside>

        {/* Products Grid */}
        <section style={{ flex: 1 }}>
          <div style={{ 
            background: 'white',
            padding: '15px 20px',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            marginBottom: '20px'
          }}>
            <p style={{ margin: 0, color: '#6c757d' }}>
              Showing <strong style={{ color: '#2d6a4f' }}>{sorted.length}</strong> products 
              {activeCategory !== 'All' && <> in <strong style={{ color: '#2d6a4f' }}>{activeCategory}</strong></>}
            </p>
          </div>

          {sorted.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
              <FaFilter size={50} style={{ color: '#dee2e6', marginBottom: '15px' }} />
              <h3 style={{ color: '#6c757d', marginBottom: '10px' }}>No products found</h3>
              <p style={{ color: '#6c757d' }}>
                {activeCategory !== 'All' 
                  ? `No products available in ${activeCategory}. Try another category.`
                  : 'No products available at the moment.'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '20px' }}>
              {sorted.map(product => {
                const traderId = getTraderId(product);
                const traderName = getTraderName(product);
                const isInCart = cart.find(item => item._id === product._id);
                
                return (
                  <div 
                    key={product._id} 
                    style={{
                      background: 'white',
                      padding: '20px',
                      borderRadius: '12px',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                      display: 'flex',
                      gap: '20px',
                      alignItems: 'flex-start',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      border: isInCart ? '2px solid #2d6a4f' : '2px solid transparent'
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
                    {product.image && (
                      <img 
                        src={product.image} 
                        alt={product.name}
                        style={{ 
                          width: '120px', 
                          height: '120px', 
                          objectFit: 'cover', 
                          borderRadius: '8px',
                          flexShrink: 0 
                        }}
                      />
                    )}
                    <div style={{ flex: 1 }}>
                      <h4 style={{ 
                        margin: '0 0 8px 0',
                        color: '#1b4332',
                        fontSize: '1.3rem'
                      }}>
                        {product.name}
                      </h4>
                      <div style={{ 
                        color: '#6c757d', 
                        fontSize: '1rem', 
                        marginBottom: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px',
                        flexWrap: 'wrap'
                      }}>
                        <span style={{
                          background: '#e9ecef',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '0.85rem'
                        }}>
                          {product.category}
                        </span>
                        <strong style={{ color: '#2d6a4f', fontSize: '1.2rem' }}>
                          ${product.price?.toFixed(2) || '0.00'}
                        </strong>
                      </div>
                      {product.description && (
                        <p style={{ 
                          color: '#6c757d', 
                          fontSize: '0.95rem', 
                          marginBottom: '12px',
                          lineHeight: '1.4'
                        }}>
                          {product.description.substring(0, 120)}
                          {product.description.length > 120 && '...'}
                        </p>
                      )}
                      <div style={{ 
                        color: '#6c757d', 
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px',
                        flexWrap: 'wrap'
                      }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <FaLeaf /> {product.carbonEmission || 0} kg CO2
                        </span>
                        <span>
                          {product.quantity || 0} {product.unit || 'pieces'} available
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <FaUser /> {traderName}
                        </span>
                      </div>
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      gap: '10px', 
                      flexDirection: 'column', 
                      flexShrink: 0,
                      minWidth: '140px'
                    }}>
                      {traderId && (
                        <Link to={`/inspect/${traderId}`} style={{ textDecoration: 'none' }}>
                          <button style={{
                            padding: '10px 16px',
                            borderRadius: '8px',
                            background: 'transparent',
                            color: '#2d6a4f',
                            border: '2px solid #2d6a4f',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '14px',
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                          }}>
                            <FaUser /> View Trader
                          </button>
                        </Link>
                      )}
                      
                      {isInCart ? (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          justifyContent: 'center'
                        }}>
                          <button
                            onClick={() => updateQuantity(product._id, (cart.find(item => item._id === product._id)?.quantity || 0) - 1)}
                            style={{
                              padding: '8px',
                              background: '#e5383b',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer'
                            }}
                          >
                            <FaMinus size={12} />
                          </button>
                          <span style={{ fontWeight: '600', minWidth: '20px', textAlign: 'center' }}>
                            {isInCart.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(product._id, (cart.find(item => item._id === product._id)?.quantity || 0) + 1)}
                            style={{
                              padding: '8px',
                              background: '#2d6a4f',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer'
                            }}
                          >
                            <FaPlus size={12} />
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => addToCart(product)}
                          style={{
                            padding: '12px 16px',
                            borderRadius: '8px',
                            background: 'linear-gradient(135deg, #2d6a4f 0%, #40916c 100%)',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            transition: 'transform 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                          <FaShoppingCart /> Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Shopping Cart Sidebar */}
      {showCart && (
        <div style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '400px',
          height: '100vh',
          background: 'white',
          boxShadow: '-5px 0 15px rgba(0,0,0,0.1)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            padding: '20px',
            borderBottom: '1px solid #e9ecef',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h3 style={{ margin: 0, color: '#1b4332' }}>Shopping Cart</h3>
            <button
              onClick={() => setShowCart(false)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                color: '#6c757d'
              }}
            >
              ×
            </button>
          </div>
          
          <div style={{ flex: 1, overflow: 'auto', padding: '20px' }}>
            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6c757d' }}>
                <FaShoppingCart size={40} style={{ marginBottom: '15px', opacity: 0.5 }} />
                <p>Your cart is empty</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {cart.map(item => (
                  <div key={item.cartId} style={{
                    display: 'flex',
                    gap: '12px',
                    padding: '15px',
                    background: '#f8f9fa',
                    borderRadius: '8px'
                  }}>
                    {item.image && (
                      <img 
                        src={item.image} 
                        alt={item.name}
                        style={{
                          width: '60px',
                          height: '60px',
                          objectFit: 'cover',
                          borderRadius: '6px',
                          flexShrink: 0
                        }}
                      />
                    )}
                    <div style={{ flex: 1 }}>
                      <h5 style={{ margin: '0 0 5px 0', color: '#1b4332' }}>
                        {item.name}
                      </h5>
                      <p style={{ margin: '0 0 8px 0', color: '#6c757d', fontSize: '14px' }}>
                        ${item.price?.toFixed(2)} × {item.quantity}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          style={{
                            padding: '4px 8px',
                            background: '#e5383b',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          <FaMinus />
                        </button>
                        <span style={{ fontWeight: '600', minWidth: '20px', textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          style={{
                            padding: '4px 8px',
                            background: '#2d6a4f',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          <FaPlus />
                        </button>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <strong style={{ color: '#2d6a4f' }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </strong>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#e5383b',
                          cursor: 'pointer',
                          fontSize: '12px',
                          marginTop: '5px'
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {cart.length > 0 && (
            <div style={{
              padding: '20px',
              borderTop: '1px solid #e9ecef',
              background: '#f8f9fa'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '15px',
                fontSize: '18px',
                fontWeight: '600'
              }}>
                <span>Total:</span>
                <span style={{ color: '#2d6a4f' }}>${getCartTotal().toFixed(2)}</span>
              </div>
              <button
                style={{
                  width: '100%',
                  padding: '15px',
                  background: 'linear-gradient(135deg, #2d6a4f 0%, #40916c 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '16px'
                }}
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      )}

      {/* Overlay when cart is open */}
      {showCart && (
        <div
          onClick={() => setShowCart(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 999
          }}
        />
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

export default ProductsAvailable;
