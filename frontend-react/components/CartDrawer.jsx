import React from 'react';

function CartDrawer({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onUpdateObservation, onCheckout }) {
  if (!isOpen) return null;

  const total = cartItems.reduce((sum, item) => sum + (parseFloat(item.precio) || 0) * item.cantidad, 0);

  return (
    <>
      <div 
        id="overlay-carrito-lateral" 
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)', zIndex: 9998 }}
      ></div>
      <div 
        id="panel-carrito-lateral" 
        style={{ 
          position: 'fixed', top: 0, right: 0, width: '100%', maxWidth: '360px', height: '100vh', 
          background: 'white', zIndex: 9999, boxShadow: '-5px 0 25px rgba(0,0,0,0.15)', 
          display: 'flex', flexDirection: 'column', transition: 'right 0.35s ease', 
          boxSizing: 'border-box', padding: '1.5px' 
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.5px solid var(--rosa-claro)', paddingBottom: '0.8rem', marginBottom: '0.8rem', padding: '0 1rem' }}>
          <h3 style={{ fontFamily: 'var(--f-titulo)', color: 'var(--rosa)', margin: 0, fontSize: '1.3rem' }}>Tu Carrito</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.1rem', fontWeight: 'bold', color: '#C93A5B', cursor: 'pointer' }}>✕</button>
        </div>
        
        <div id="lista-items-carrito" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', overflowY: 'auto', flex: 1, marginBottom: '0.8rem', padding: '0 1rem' }}>
          {cartItems.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--tinta)', padding: '2rem' }}>Tu carrito está vacío.</p>
          ) : (
            cartItems.map((item, index) => (
              <div key={index} style={{ background: '#FFF7FA', padding: '0.9rem', borderRadius: '14px', border: '1.5px solid var(--rosa-claro)', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--tinta)', display: 'block' }}>{item.nombre}</strong>
                    <span style={{ fontSize: '0.82rem', color: 'var(--rosa)', fontWeight: 700 }}>${parseFloat(item.precio).toFixed(2)} x {item.cantidad}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                    <button onClick={() => onUpdateQuantity(index, -1)} style={{ background: 'var(--rosa-pastel)', border: 'none', width: '22px', height: '22px', borderRadius: '50%', fontWeight: 'bold', cursor: 'pointer' }}>-</button>
                    <button onClick={() => onUpdateQuantity(index, 1)} style={{ background: 'var(--rosa-pastel)', border: 'none', width: '22px', height: '22px', borderRadius: '50%', fontWeight: 'bold', cursor: 'pointer' }}>+</button>
                    <button onClick={() => onRemoveItem(index)} style={{ background: 'none', border: 'none', color: '#C93A5B', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.95rem', marginLeft: '2px' }}>✕</button>
                  </div>
                </div>
                <div>
                  <input 
                    type="text" 
                    value={item.observacion || ''} 
                    onChange={(e) => onUpdateObservation(index, e.target.value)}
                    placeholder="Nota opcional: (Ej: Color rosa...)" 
                    style={{ width: '100%', padding: '5px 8px', fontSize: '0.8rem', borderRadius: '8px', border: '1px solid var(--rosa-claro)', background: 'white' }} 
                  />
                </div>
              </div>
            ))
          )}
        </div>

        <div style={{ borderTop: '1.5px solid var(--rosa-claro)', paddingTop: '0.8rem', padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 700, fontSize: '1rem', marginBottom: '0.6rem' }}>
            <span>Total referencial:</span>
            <span style={{ color: 'var(--rosa)' }}>${total.toFixed(2)}</span>
          </div>
          <button onClick={onCheckout} className="boton-primario" style={{ width: '100%', textAlign: 'center', backgroundColor: 'var(--rosa)', color: '#fff', borderRadius: 'var(--radio-pill)', padding: '0.65rem', border: 'none', fontWeight: 700, cursor: 'pointer' }}>Proceder al encargo</button>
        </div>
      </div>
    </>
  );
}

export default CartDrawer;