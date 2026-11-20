import React from 'react';

function CartDrawer({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onUpdateObservation, onCheckout }) {
  if (!isOpen) return null;

  const total = cartItems.reduce((sum, item) => sum + (parseFloat(item.precio) || 0) * item.cantidad, 0);

  const handleProcederPedido = () => {
    let resumen = 'Pedido desde el carrito:\n';
    cartItems.forEach(i => {
      resumen += `- ${i.cantidad}x ${i.nombre} ($${((parseFloat(i.precio) || 0) * i.cantidad).toFixed(2)})`;
      if (i.observacion && i.observacion.trim() !== '') {
        resumen += ` [Nota: ${i.observacion.trim()}]`;
      }
      resumen += '\n';
    });

    onCheckout(resumen);
  };

  return (
    <>
      <div 
        onClick={onClose}
        style={{ display: 'block', position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)', zIndex: 9998 }}
      />
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        maxWidth: '360px',
        height: '100dvh',
        maxHeight: '100dvh',
        background: 'white',
        zIndex: 9999,
        boxShadow: '-5px 0 25px rgba(0,0,0,0.15)',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        padding: '1.25rem 1.25rem calc(1.25rem + env(safe-area-inset-bottom)) 1.25rem',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.5px solid var(--rosa-claro)', paddingBottom: '0.75rem', marginBottom: '0.75rem', flexShrink: 0 }}>
          <h3 style={{ fontFamily: 'var(--f-titulo)', color: 'var(--rosa)', margin: 0, fontSize: '1.3rem' }}>Tu Carrito</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.1rem', fontWeight: 'bold', color: '#C93A5B', cursor: 'pointer' }}>✕</button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', overflowY: 'auto', flex: '1 1 auto', minHeight: 0, paddingRight: '2px', marginBottom: '0.75rem' }}>
          {cartItems.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--tinta)', padding: '2rem' }}>Tu carrito está vacío.</p>
          ) : (
            cartItems.map((item, index) => (
              <div key={index} style={{ background: '#FFF7FA', padding: '0.9rem', borderRadius: '14px', border: '1.5px solid var(--rosa-claro)', display: 'flex', flexDirection: 'column', gap: '0.6rem', flexShrink: 0 }}>
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
                    placeholder="Nota opcional: (Ej: En vez de color rosa...)" 
                    style={{ width: '100%', padding: '5px 8px', fontSize: '0.8rem', borderRadius: '8px', border: '1px solid var(--rosa-claro)', background: 'white' }} 
                  />
                </div>
              </div>
            ))
          )}
        </div>

        <div style={{ borderTop: '1.5px solid var(--rosa-claro)', paddingTop: '0.75rem', flexShrink: 0, background: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 700, fontSize: '1rem', marginBottom: '0.6rem' }}>
            <span>Total referencial:</span>
            <span style={{ color: 'var(--rosa)' }}>${total.toFixed(2)}</span>
          </div>
          <button 
            onClick={handleProcederPedido} 
            style={{ width: '100%', textAlign: 'center', backgroundColor: 'var(--rosa)', color: '#fff', borderRadius: 'var(--radio-pill)', padding: '0.7rem', border: 'none', fontWeight: 700, cursor: 'pointer' }}
          >
            Proceder al encargo
          </button>
        </div>
      </div>
    </>
  );
}

export default CartDrawer;