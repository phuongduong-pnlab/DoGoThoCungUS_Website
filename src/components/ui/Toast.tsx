import React, { useEffect, useState } from 'react';
import '../../styles/ui/Toast.css';

interface ToastProps {
    message: string;
    duration?: number;
    onClose: () => void;
}

export default function Toast({ message, duration = 3000, onClose }: ToastProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Trigger enter animation
        const timer = setTimeout(() => setVisible(true), 10);
        
        // Trigger exit animation
        const hideTimer = setTimeout(() => setVisible(false), duration - 300);
        
        // Final cleanup
        const closeTimer = setTimeout(onClose, duration);

        return () => {
            clearTimeout(timer);
            clearTimeout(hideTimer);
            clearTimeout(closeTimer);
        };
    }, [duration, onClose]);

    return (
        <div className={`toast-container ${visible ? 'visible' : ''}`}>
            <div className="toast-content">
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="toast-icon"
                >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span className="toast-message">{message}</span>
            </div>
        </div>
    );
}
