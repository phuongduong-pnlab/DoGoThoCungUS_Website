import React, { useState, useEffect } from 'react';
import '../styles/components/ProductList.css';

// Types
interface Product {
  id: string;
  name: string;
  category: string;
  price: string | number;
  images: string[];
  variants: any[];
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Categories
  const categories = ['All', ...new Set(products.map(p => p.category))];

  useEffect(() => {
    // Fetch products
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch products", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Filter logic
    let result = products;

    if (activeCategory !== 'All') {
      result = result.filter(p => p.category === activeCategory);
    }

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(lowerTerm) || 
        p.category.toLowerCase().includes(lowerTerm)
      );
    }

    setFilteredProducts(result);
  }, [searchTerm, activeCategory, products]);

  const toggleLove = (id: string, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link click
    const loved = JSON.parse(localStorage.getItem('lovedProducts') || '[]');
    if (loved.includes(id)) {
      const newLoved = loved.filter((lid: string) => lid !== id);
      localStorage.setItem('lovedProducts', JSON.stringify(newLoved));
    } else {
      loved.push(id);
      localStorage.setItem('lovedProducts', JSON.stringify(loved));
    }
    alert(`Product ${id} updated in favorites!`); 
  };

  if (loading) return <div className="loading-state">Loading products...</div>;

  return (
    <div className="product-list-container">
      {/* Controls */}
      <div className="list-controls">
        <div className="category-filters">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>
        
        <input 
          type="text" 
          placeholder="Search products..." 
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Grid */}
      <div className="product-grid">
        {filteredProducts.map(product => (
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
              <p className="card-category">{product.category}</p>
              
              <button 
                onClick={(e) => toggleLove(product.id, e)}
                className="btn-love"
              >
                Add to Loved
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {filteredProducts.length === 0 && (
          <div className="empty-state">No products found.</div>
      )}
    </div>
  );
}
