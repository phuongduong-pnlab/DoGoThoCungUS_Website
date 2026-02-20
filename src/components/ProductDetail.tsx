import React, { useState } from 'react';
import '../styles/components/ProductDetail.css';
import Toast from './ui/Toast';
import OptimizedImage from './ui/OptimizedImage';
import { cmToInches, formatSizeInches } from '../lib/utils';

interface Product {
    id: string;
    name: string;
    category: string;
    description: string;
    images: string[];
    variants: Array<{
        size?: string;
        color?: string;
        price: number;
        [key: string]: any;
    }>;
    price: number | string;
}

export default function ProductDetail({ product }: { product: Product }) {
    const [selectedImage, setSelectedImage] = useState(product.images[0]);
    const [selectedVariant, setSelectedVariant] = useState(product.variants[0] || null);
    const [toast, setToast] = useState<{ message: string } | null>(null);
    const [isZoomed, setIsZoomed] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);
    const [isLoved, setIsLoved] = useState(false);
    const [contactForm, setContactForm] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });

    // Check if product is loved on mount and when product.id changes
    React.useEffect(() => {
        const loved = JSON.parse(localStorage.getItem('loved_products') || '[]');
        setIsLoved(!!loved.find((p: any) => p.sku === product.id));
    }, [product.id]);

    // If variants exist, prioritize them, otherwise use base product
    const currentPrice = selectedVariant ? selectedVariant.price : product.price;

    const handleSelectVariant = (variant: any) => {
        setSelectedVariant(variant);
        if (variant.images && variant.images.length > 0) {
            setSelectedImage(variant.images[0]);
        }
    };

    const addToLoved = () => {
        const loved = JSON.parse(localStorage.getItem('loved_products') || '[]');
        const existingIndex = loved.findIndex((p: any) => p.sku === product.id);
        
        if (existingIndex === -1) {
            loved.push({
                sku: product.id,
                name: product.name,
                price: product.price,
                images: product.images,
                category: product.category,
                size: selectedVariant?.size
            });
            setIsLoved(true);
            setToast({ message: "Đã thêm vào sản phẩm yêu thích!" });
        } else {
            loved.splice(existingIndex, 1);
            setIsLoved(false);
            setToast({ message: "Đã xóa khỏi sản phẩm yêu thích." });
        }
        
        localStorage.setItem('loved_products', JSON.stringify(loved));
        window.dispatchEvent(new Event('loved-products-updated'));
    };

    const handleContactSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically send the data to an API
        console.log('Contact Form Submitted:', contactForm);
        setToast({ message: "Cảm ơn bạn! Chúng tôi sẽ liên hệ lại sớm nhất." });
        setShowContactModal(false);
        setContactForm({ name: '', email: '', phone: '', message: '' });
    };

    // Body scroll lock
    React.useEffect(() => {
        if (isZoomed || showContactModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isZoomed, showContactModal]);

    // Pre-fill contact message when modal opens
    React.useEffect(() => {
        if (showContactModal) {
            const variantStr = selectedVariant 
                ? ` (${selectedVariant.size || ''} ${selectedVariant.color || ''})`.trim() 
                : '';
            setContactForm(prev => ({
                ...prev,
                message: `Xin chào, tôi quan tâm đến sản phẩm "${product.name}${variantStr}". Vui lòng tư vấn thêm cho tôi về cách đặt hàng.`
            }));
        }
    }, [showContactModal, product.name, selectedVariant]);

    return (
        <div className="product-detail-grid">
            {/* Gallery */}
            <div className="gallery-section">
                <div 
                    className="main-image-container group clickable"
                    onClick={() => setIsZoomed(true)}
                >
                    <OptimizedImage 
                      src={selectedImage} 
                      alt={product.name} 
                      width={800}
                      className="main-image-optimized"
                    />
                    <div className="zoom-hint">🔍 Nhấn để phóng to</div>
                </div>
                <div className="thumbnail-list">
                    {product.images.map((img, idx) => (
                        <button 
                            key={idx} 
                            onClick={() => setSelectedImage(img)}
                            className={`thumbnail-btn ${selectedImage === img ? 'active' : ''}`}
                        >
                            <OptimizedImage 
                              src={img} 
                              alt={`View ${idx + 1}`} 
                              width={100}
                              className="thumbnail-img-optimized"
                            />
                        </button>
                    ))}
                </div>
            </div>

            {/* Zoom Modal */}
            {isZoomed && (
                <div className="zoom-overlay" onClick={() => setIsZoomed(false)}>
                    <div className="zoom-modal" onClick={e => e.stopPropagation()}>
                        <button className="zoom-close" onClick={() => setIsZoomed(false)}>✕</button>
                        <div className="zoom-image-wrapper">
                            <img src={selectedImage} alt={product.name} className="zoomed-image" />
                        </div>
                    </div>
                </div>
            )}

            {/* Contact Modal */}
            {showContactModal && (
                <div className="contact-overlay" onClick={() => setShowContactModal(false)}>
                    <div className="contact-modal" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setShowContactModal(false)}>✕</button>
                        <h2>Liên hệ đặt hàng</h2>
                        <p className="modal-subtitle">{product.name}</p>
                        
                        <form onSubmit={handleContactSubmit} className="contact-form">
                            <div className="form-group">
                                <label>Họ và tên</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={contactForm.name}
                                    onChange={e => setContactForm({...contactForm, name: e.target.value})}
                                    placeholder="Nhập tên của bạn"
                                />
                            </div>
                            <div className="form-group">
                                <label>Số điện thoại</label>
                                <input 
                                    type="tel" 
                                    required 
                                    value={contactForm.phone}
                                    onChange={e => setContactForm({...contactForm, phone: e.target.value})}
                                    placeholder="Nhập số điện thoại"
                                />
                            </div>
                            <div className="form-group">
                                <label>Email (Tùy chọn)</label>
                                <input 
                                    type="email" 
                                    value={contactForm.email}
                                    onChange={e => setContactForm({...contactForm, email: e.target.value})}
                                    placeholder="Nhập email"
                                />
                            </div>
                            <div className="form-group">
                                <label>Lời nhắn</label>
                                <textarea 
                                    required 
                                    rows={4}
                                    value={contactForm.message}
                                    onChange={e => setContactForm({...contactForm, message: e.target.value})}
                                ></textarea>
                            </div>
                            <button type="submit" className="btn-submit">Gửi yêu cầu</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Info */}
            <div className="info-section">
                <h1 className="product-title">{product.name}</h1>
                <p className="product-category">{product.category}</p>

                <div className="product-description">
                    {product.description && product.description.includes('•') ? (
                        <ul className="description-list">
                            {product.description.split('\n').filter(line => line.trim()).map((line, idx) => (
                                <li key={idx}>{line.replace(/^•\s*/, '')}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>{product.description}</p>
                    )}
                </div>

                {/* Variants (Sizes) */}
                {product.variants && product.variants.length > 0 && (
                   <div className="variants-section">
                       <h3>Kích thước: Ngang x Hông x Cao</h3>
                       <div className="size-scroll-wrapper">
                           <div className="size-options-container">
                               {product.variants.map((v, idx) => (
                                   <div key={idx} className="size-item-card">
                                       <span className="size-label-cm">{v.size}cm</span>
                                       <span className="size-label-in">{formatSizeInches(v.size || '')}in</span>
                                   </div>
                               ))}
                           </div>
                       </div>
                   </div>
                )}

                {/* Actions */}
                <div className="actions-section">
                    <button 
                        className="btn-primary-large"
                        onClick={() => setShowContactModal(true)}
                    >
                        Contact to Order
                    </button>
                    <button 
                        className={`btn-secondary-large ${isLoved ? 'btn-loved-active' : ''}`}
                        onClick={addToLoved}
                    >
                        <svg 
                            className="heart-icon"
                            xmlns="http://www.w3.org/2000/svg" 
                            width="20" 
                            height="20" 
                            viewBox="0 0 25 25" 
                            fill={isLoved ? "currentColor" : "none"}
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                        >
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.89-8.89 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                        <span>{isLoved ? 'Loved' : 'Add to Loved'}</span>
                    </button>
                </div>
            </div>
            {toast && (
                <Toast 
                    message={toast.message} 
                    onClose={() => setToast(null)} 
                />
            )}
        </div>
    );
}
