import React, { useState, useEffect } from 'react';
import '../styles/components/ProductList.css';
import Toast from './ui/Toast';
import { toSlug, removeAccents } from '../lib/utils';

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
  const [activeCategory, setActiveCategory] = useState('Tất Cả');
  const [toast, setToast] = useState<{ message: string } | null>(null);

  // Categories
  const categories = ['Tất Cả', ...new Set(products.map(p => p.category))];

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

    if (activeCategory !== 'Tất Cả') {
      result = result.filter(p => p.category === activeCategory);
    }

    if (searchTerm) {
      const searchWords = removeAccents(searchTerm.toLowerCase()).trim().split(/\s+/).filter(Boolean);
      
      result = result.filter(p => {
        const normalizedName = removeAccents(p.name.toLowerCase());
        const normalizedCategory = removeAccents(p.category.toLowerCase());
        
        // Collect all sizes from variants for searching
        const sizes = (p.variants || [])
          .map((v: any) => removeAccents((v.size || '').toString().toLowerCase()))
          .join(' ');

        // Every word in the search term must be found in name, category, or size
        return searchWords.every(word => 
          normalizedName.includes(word) || 
          normalizedCategory.includes(word) ||
          sizes.includes(word)
        );
      });
    }

    setFilteredProducts(result);
  }, [searchTerm, activeCategory, products]);

  const addToLoved = (id: string, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link click
    const loved = JSON.parse(localStorage.getItem('lovedProducts') || '[]');
    let message = '';
    
    if (!loved.includes(id)) {
      loved.push(id);
      localStorage.setItem('lovedProducts', JSON.stringify(loved));
      message = 'Đã thêm vào danh sách yêu thích!';
      
      // Notify other components (like LovedProducts) that the list has changed
      window.dispatchEvent(new Event('lovedProductsUpdated'));
      setToast({ message });
    } else {
      setToast({ message: 'Sản phẩm đã có trong danh sách yêu thích!' });
    }
  };

  if (loading) {
    return (
      <div className="product-list-container">
        <div className="list-controls">
          <div className="category-filters">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="skeleton-filter"></div>
            ))}
          </div>
          <div className="skeleton-search"></div>
        </div>
        <div className="product-grid">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-image"></div>
              <div className="skeleton-content">
                <div className="skeleton-title"></div>
                <div className="skeleton-title" style={{ width: '60%' }}></div>
                <div className="skeleton-btn"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

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
        
        {searchTerm && (
          <div className="search-results-info">
            Tìm thấy {filteredProducts.length} sản phẩm cho "{searchTerm}"
          </div>
        )}

        <div className="search-box">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="search-icon"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            placeholder="Tìm sản phẩm..." 
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={(e) => e.target.select()}
          />
          {searchTerm && (
            <button 
              className="clear-search-btn" 
              onClick={() => setSearchTerm('')}
              aria-label="Clear search"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="product-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            <a href={`/products/${toSlug(product.name)}`} className="card-image-link">
               {product.images[0] ? (
                 <img 
                   src={product.images[0]} 
                   alt={product.name} 
                   className="card-image"
                 />
               ) : (
                 <div className="no-image">Sản phẩm chưa có ảnh</div>
               )}
            </a>

            <div className="card-content">
              <div className="card-header">
                 <h3 className="card-title">
                   <a href={`/products/${toSlug(product.name)}`}>{product.name}</a>
                 </h3>
              </div>
              {/* <p className="card-category">{product.category}</p> */}
              
              <button 
                onClick={(e) => addToLoved(product.id, e)}
                className="btn-love"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="18" 
                  height="18" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.89-8.89 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                <span>Add to Loved</span>
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {filteredProducts.length === 0 && (
          <div className="empty-state">Không tìm thấy sản phẩm.</div>
      )}

      {toast && (
        <Toast 
          message={toast.message} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
}
