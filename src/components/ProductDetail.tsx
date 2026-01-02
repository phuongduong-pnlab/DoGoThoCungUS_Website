import React, { useState } from 'react';
import '../styles/components/ProductDetail.css';

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

    // If variants exist, prioritize them, otherwise use base product
    const currentPrice = selectedVariant ? selectedVariant.price : product.price;

    const handleSelectVariant = (variant: any) => {
        setSelectedVariant(variant);
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
                    {/* Zoom hint could go here */}
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
                <div className="product-price">${currentPrice}</div>

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
                    <button className="btn-primary-large">
                        Contact to Order
                    </button>
                    <button className="btn-secondary-large">
                        Add to Loved
                    </button>
                </div>
            </div>
        </div>
    );
}
