import React, { useState, useEffect, useRef } from 'react';
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
  const imgRef = useRef<HTMLImageElement>(null);
  
  const optimizedSrc = optimizeCloudinary(src, width);

  // Reset states when src changes
  useEffect(() => {
    setLoaded(false);
    setError(false);
  }, [src]);

  // Handle cached images
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setLoaded(true);
    }
  }, [src]);

  return (
    <div className={`optimized-image-container ${className} ${loaded ? 'loaded' : 'loading'}`} onClick={onClick}>
      {!loaded && !error && <div className="image-skeleton-pulse"></div>}
      
      {src ? (
        <img
          ref={imgRef}
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
