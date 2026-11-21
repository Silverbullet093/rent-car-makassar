import React, { useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            if (onClose) onClose();
        }, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);

    if (!message) return null;

    const isSuccess = type === 'success';

    return (
        <div style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            zIndex: 99999,
            background: isSuccess ? '#059669' : '#dc2626',
            color: '#ffffff',
            padding: '0.85rem 1.35rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '0.875rem',
            fontWeight: 700,
            animation: 'fadeInUp 0.3s ease'
        }}>
            <i className={`fa-solid ${isSuccess ? 'fa-circle-check' : 'fa-circle-exclamation'}`} style={{ fontSize: '1.1rem' }}></i>
            <span>{message}</span>
            <button
                type="button"
                onClick={onClose}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', marginLeft: '0.5rem', fontSize: '0.9rem' }}
            >
                <i className="fa-solid fa-xmark"></i>
            </button>
        </div>
    );
}
