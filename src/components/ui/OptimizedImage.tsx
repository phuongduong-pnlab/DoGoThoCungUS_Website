import React, { useState, useEffect } from 'react';
import { optimizeCloudinary } from '../../lib/utils';
import './OptimizedImage.css';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export default function OptimizedImage({ src, alt, width, className = '', onClick }: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  
  const optimizedSrc = optimizeCloudinary(src, width);

  return (
    <div className={`optimized-image-container ${className} ${loaded ? 'loaded' : 'loading'}`} onClick={onClick}>
      {!loaded && !error && <div className="image-skeleton-pulse"></div>}
      
      {src ? (
        <img
          src={optimizedSrc}
          alt={alt}
          className={`optimized-image ${loaded ? 'visible' : 'hidden'}`}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      ) : (
        <div className="no-image-placeholder">Sản phẩm chưa có ảnh</div>
      )}
      
      {error && <div className="image-error">Lỗi tải ảnh</div>}
    </div>
  );
}
