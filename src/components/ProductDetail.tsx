import React, { useState } from 'react';
import '../styles/components/ProductDetail.css';
import Toast from './ui/Toast';

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

    // If variants exist, prioritize them, otherwise use base product
    const currentPrice = selectedVariant ? selectedVariant.price : product.price;

    const handleSelectVariant = (variant: any) => {
        setSelectedVariant(variant);
    };

    const addToLoved = () => {
        const loved = JSON.parse(localStorage.getItem('lovedProducts') || '[]');
        let message = '';
        
        if (!loved.includes(product.id)) {
            loved.push(product.id);
            localStorage.setItem('lovedProducts', JSON.stringify(loved));
            message = 'Đã thêm vào danh sách yêu thích!';
            
            // Notify other components (like LovedProducts) that the list has changed
            window.dispatchEvent(new Event('lovedProductsUpdated'));
            setToast({ message });
        } else {
            setToast({ message: 'Sản phẩm đã có trong danh sách yêu thích!' });
        }
    };

    return (
        <div className="product-detail-grid">
            {/* Gallery */}
            <div className="gallery-section">
                <div className="main-image-container group">
                    {selectedImage ? (
                        <img src={selectedImage} alt={product.name} className="main-image" />
                    ) : (
                        <div className="no-image-large">No Image</div>
                    )}
                </div>
                <div className="thumbnail-list">
                    {product.images.map((img, idx) => (
                        <button 
                            key={idx} 
                            onClick={() => setSelectedImage(img)}
                            className={`thumbnail-btn ${selectedImage === img ? 'active' : ''}`}
                        >
                            <img src={img} alt={`View ${idx + 1}`} />
                        </button>
                    ))}
                </div>
            </div>

            {/* Info */}
            <div className="info-section">
                <h1 className="product-title">{product.name}</h1>
                <p className="product-category">{product.category}</p>

                <div className="product-description">
                    <p>{product.description}</p>
                </div>

                {/* Variants */}
                {product.variants && product.variants.length > 0 && (
                   <div className="variants-section">
                       <h3>Available Options</h3>
                       <div className="variant-options">
                           {product.variants.map((v, idx) => (
                               <button
                                   key={idx}
                                   onClick={() => handleSelectVariant(v)}
                                   className={`variant-chip ${selectedVariant === v ? 'active' : ''}`}
                               >
                                   {v.size && <span>{v.size}</span>}
                                   {v.color && <span> - {v.color}</span>}
                               </button>
                           ))}
                       </div>
                   </div>
                )}

                {/* Actions */}
                <div className="actions-section">
                    <button 
                        className="btn-primary-large"
                        onClick={() => {
                            const variantStr = selectedVariant 
                                ? ` (${selectedVariant.size || ''} ${selectedVariant.color || ''})`.trim() 
                                : '';
                            const message = encodeURIComponent(`Hi, I am interested in "${product.name}${variantStr}". Please provide more details on how to order.`);
                            window.location.href = `/contact?message=${message}`;
                        }}
                    >
                        Contact to Order
                    </button>
                    <button 
                        className="btn-secondary-large"
                        onClick={addToLoved}
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="20" 
                            height="20" 
                            viewBox="0 0 25 25" 
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
            {toast && (
                <Toast 
                    message={toast.message} 
                    onClose={() => setToast(null)} 
                />
            )}
        </div>
    );
}
