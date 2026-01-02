import React, { useState, useEffect } from 'react';
import '../styles/components/ProductList.css'; // Re-use list styles

interface Product {
  id: string;
  name: string;
  category: string;
  price: string | number;
  images: string[];
}

export default function LovedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [lovedIds, setLovedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Get Loved IDs
    const stored = JSON.parse(localStorage.getItem('lovedProducts') || '[]');
    setLovedIds(stored);

    // 2. Fetch all products (optimization: fetch specific IDs if API supported it, but simple for now)
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        // Filter only loved
        const loved = data.filter((p: Product) => stored.includes(p.id));
        setProducts(loved);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch products", err);
        setLoading(false);
      });
  }, []);

  const removeLove = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    const newIds = lovedIds.filter(lid => lid !== id);
    setLovedIds(newIds);
    localStorage.setItem('lovedProducts', JSON.stringify(newIds));
    setProducts(products.filter(p => p.id !== id));
  };

  if (loading) return <div className="loading-state">Loading your favorites...</div>;

  if (products.length === 0) {
    return (
        <div className="empty-state">
            <h2>No loved products yet.</h2>
            <p>Go back to our <a href="/products" className="text-[var(--color-primary)]">collection</a> and find something you like!</p>
        </div>
    );
  }

  return (
    <div className="product-list-container">
      <h1 className="text-2xl font-serif font-bold mb-8 text-[var(--color-secondary)]">Your Loved Items</h1>
      <div className="product-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <a href={`/products/${product.id}`} className="card-image-link">
               {product.images[0] ? (
                 <img 
                   src={product.images[0]} 
                   alt={product.name} 
                   className="card-image"
                 />
               ) : (
                 <div className="no-image">No Image</div>
               )}
            </a>

            <div className="card-content">
              <div className="card-header">
                 <h3 className="card-title">
                   <a href={`/products/${product.id}`}>{product.name}</a>
                 </h3>
                 <span className="card-price">${product.price}</span>
              </div>
              
              <button 
                onClick={(e) => removeLove(product.id, e)}
                className="btn-love text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
