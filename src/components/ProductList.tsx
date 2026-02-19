import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../styles/components/ProductList.css';
import Toast from './ui/Toast';
import OptimizedImage from './ui/OptimizedImage';
import { toSlug, removeAccents, formatSizeInches } from '../lib/utils';

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
  const [categories, setCategories] = useState<string[]>(['Tất Cả']);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tất Cả');
  const [toast, setToast] = useState<{ message: string } | null>(null);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastProductElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    if (page > 1) {
      loadProducts(false);
    }
  }, [page]);

  // Fetch Categories once
  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(['Tất Cả', ...data]))
      .catch(err => console.error("Failed to fetch categories", err));
  }, []);

  useEffect(() => {
    setPage(1); // Reset page on filter change
    loadProducts(true);
  }, [searchTerm, activeCategory]);

  const loadProducts = (reset = false) => {
    setLoading(true);
    const currentPage = reset ? 1 : page;
    
    const params = new URLSearchParams();
    params.append('page', currentPage.toString());
    params.append('limit', '12');
    if (searchTerm) params.append('q', searchTerm);
    if (activeCategory !== 'Tất Cả') params.append('category', activeCategory);

    fetch(`/api/products?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        if (reset) {
          setProducts(data.products || []);
          setPage(1);
        } else {
          setProducts(prev => [...prev, ...(data.products || [])]);
          setPage(currentPage);
        }
        setHasMore(data.hasMore);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch products", err);
        setLoading(false);
      });
  };

  const addToLoved = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    const loved = JSON.parse(localStorage.getItem('lovedProducts') || '[]');
    let message = '';
    
    if (!loved.includes(id)) {
      loved.push(id);
      localStorage.setItem('lovedProducts', JSON.stringify(loved));
      message = 'Đã thêm vào danh sách yêu thích!';
      window.dispatchEvent(new Event('lovedProductsUpdated'));
      setToast({ message });
    } else {
      setToast({ message: 'Sản phẩm đã có trong danh sách yêu thích!' });
    }
  };

  if (loading && products.length === 0) {
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
            Tìm thấy {products.length} sản phẩm cho "{searchTerm}"
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
        {products.map((product, index) => {
          const isLast = products.length === index + 1;
          return (
            <div 
              key={`${product.id}-${product.name}-${index}`} 
              className="product-card"
              ref={isLast ? lastProductElementRef : null}
            >
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
                
                <div className="card-variants">
                  {product.variants && product.variants.length > 0 && (
                    <>
                      <div className="variant-info-row" style={{ fontSize: '0.75rem' ,color: 'white'}}>Kích thước: Ngang x Hông x Cao</div>
                      <div className="variant-badges">
                        {product.variants.slice(0, 10).map((v: any, idx: number) => (
                          <span key={idx} className="variant-badge">
                            <span className="badge-row-cm" style={{borderBottom: '1px solid #444'}}>{v.size}cm</span>
                            <span className="badge-row-in" >{formatSizeInches(v.size || '')}in</span>
                          </span>
                        ))}
                        {product.variants.length > 10 && <span className="variant-badge">+{product.variants.length - 10}</span>}
                      </div>
                    </>
                  )}
                </div>
                
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
          );
        })}
      </div>
      
      {loading && products.length > 0 && (
        <div className="load-more-indicator">
           <div className="loader-dots">
              <span></span><span></span><span></span>
           </div>
        </div>
      )}

      {products.length === 0 && !loading && (
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
