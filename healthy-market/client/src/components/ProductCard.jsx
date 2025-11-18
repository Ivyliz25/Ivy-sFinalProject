import React from "react";

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      {product.image && (
        <img 
          src={product.image} 
          alt={product.name} 
          style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "6px", marginBottom: "10px" }}
        />
      )}
      <h3>{product.name}</h3>
      <p>Price: ${product.price?.toFixed(2) || '0.00'}</p>
      <p>Quantity: {product.quantity || 0} {product.unit || 'pieces'}</p>
      <p>Category: {product.category}</p>
      <p>Emissions: {product.carbonEmission || 0} kg CO2</p>
    </div>
  );
};

export default ProductCard;
