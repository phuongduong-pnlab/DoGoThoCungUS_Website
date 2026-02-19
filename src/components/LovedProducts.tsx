import React, { useState, useEffect } from 'react';
import '../styles/components/ProductList.css';
import Toast from './ui/Toast';
import OptimizedImage from './ui/OptimizedImage';
import { toSlug } from '../lib/utils';

interface Product {
  id: string;
  name: string;
  category: string;
  price: string | number;
  images: string[];
  variants: any[];
}

export default function LovedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [lovedIds, setLovedIds] = useState<string[]>([]);
  const [toast, setToast] = useState<{ message: string } | null>(null);

  useEffect(() => {
    const updateLovedIds = () => {
      const loved = JSON.parse(localStorage.getItem('lovedProducts') || '[]');
      setLovedIds(loved);
    };

    updateLovedIds();

    fetch('/api/products?limit=100')
      .then(res => res.json())
      .then(data => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch products", err);
        setLoading(false);
      });

    window.addEventListener('lovedProductsUpdated', updateLovedIds);
    return () => window.removeEventListener('lovedProductsUpdated', updateLovedIds);
  }, []);

  const filteredProducts = products.filter(p => lovedIds.includes(p.id));

  const removeLoved = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    const newLoved = lovedIds.filter(lid => lid !== id);
    setLovedIds(newLoved);
    localStorage.setItem('lovedProducts', JSON.stringify(newLoved));
    setToast({ message: 'Đã xóa khỏi danh sách yêu thích!' });
  };

  if (loading) {
    return (
      <div className="product-list-container">
        <div className="product-grid">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-image"></div>
              <div className="skeleton-content">
                <div className="skeleton-title"></div>
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
      {filteredProducts.length > 0 ? (
        <div className="product-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <a href={`/products/${toSlug(product.name)}`} className="card-image-link">
                <OptimizedImage 
                  src={product.images[0]} 
                  alt={product.name} 
                  width={400}
                  className="card-image-container"
                />
              </a>

              <div className="card-content">
                <div className="card-header">
                  <h3 className="card-title">
                    <a href={`/products/${toSlug(product.name)}`}>{product.name}</a>
                  </h3>
                </div>
                
                <button 
                  onClick={(e) => removeLoved(product.id, e)}
                  className="btn-love"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'var(--color-primary)' }}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="18" 
                    height="18" 
                    viewBox="0 0 24 24" 
                    fill="currentColor" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.89-8.89 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                  <span>Bỏ Yêu Thích</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>Bạn chưa có sản phẩm yêu thích nào.</p>
          <a href="/#products" className="btn-love" style={{ display: 'inline-block', marginTop: '1rem', padding: '10px 20px', textDecoration: 'none' }}>
            Khám phá ngay
          </a>
        </div>
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
