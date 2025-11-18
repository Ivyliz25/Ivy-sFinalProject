import React, { useEffect, useState } from "react";
import api from "../services/api.js";
import ProductCard from "../components/ProductCard.jsx";

const Market = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <p>Loading market items...</p>;

  return (
    <div className="container">
      <h1>Market</h1>
      {products.length === 0 ? (
                <p>No products available.</p>
            ) : (
      <div className="grid">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
        )}
    </div>
  );
};

export default Market;
