import React from 'react';

function WhatsAppButton() {
  return (
    <a 
      href="https://wa.me/593900000000" 
      target="_blank" 
      rel="noopener noreferrer" 
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: '#25D366',
        color: '#fff',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
        zIndex: 9997,
        fontSize: '1.5rem',
        textDecoration: 'none'
      }}
    >
      💬
    </a>
  );
}

export default WhatsAppButton;