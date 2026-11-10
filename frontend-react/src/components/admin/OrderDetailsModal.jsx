import React from 'react';

function OrderDetailsModal({ modalFoto, onClose, formatearFechaTexto }) {
  if (!modalFoto) return null;

  return (
    <div style={{ display: 'flex', position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', zIndex: 9999, alignItems: 'center', justifyContent: 'center', padding: '1.5rem', boxSizing: 'border-box' }}>
      <div style={{ background: 'white', borderRadius: '28px', padding: '2rem', maxWidth: '480px', width: '100%', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', boxSizing: 'border-box' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '1.2rem', fontWeight: 'bold', color: '#C93A5B', cursor: 'pointer', padding: '4px 8px', lineHeight: 1 }}>✕</button>
        <h3 style={{ fontFamily: 'var(--f-titulo)', color: '#F2678A', margin: '0 0 1rem 0', fontSize: '1.5rem', textAlign: 'center' }}>Detalles del Encargo</h3>
        
        <div style={{ background: '#FFF7FA', border: '1.5px solid #FBC5D6', borderRadius: '16px', padding: '1rem', fontSize: '0.92rem', color: '#74404F', lineHeight: 1.5, marginBottom: '1.2rem', textAlign: 'left' }}>
          <p style={{ margin: '0.2rem 0' }}><strong>Cliente:</strong> {modalFoto.nombre}</p>
          <p style={{ margin: '0.2rem 0' }}><strong>Correo:</strong> {modalFoto.correo}</p>
          <p style={{ margin: '0.2rem 0' }}><strong>Celular:</strong> {modalFoto.celular}</p>
          <p style={{ margin: '0.2rem 0' }}><strong>Tipo:</strong> {modalFoto.producto}</p>
          <p style={{ margin: '0.2rem 0' }}><strong>Fecha de Entrega:</strong> {formatearFechaTexto(modalFoto.fechaEntrega)}</p>
          <hr style={{ border: 'none', borderTop: '1px dashed #FBC5D6', margin: '0.6rem 0' }} />
          <p style={{ margin: 0 }}><strong>Observaciones:</strong><br/>{modalFoto.detalles || 'Sin observaciones'}</p>
        </div>

        {modalFoto.imagenReferencia && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <p style={{ fontWeight: 700, fontSize: '0.85rem', color: '#F2678A', marginBottom: '0.6rem' }}>Foto de referencia adjunta:</p>
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFF7FA', border: '1.5px solid #FBC5D6', borderRadius: '18px', padding: '0.8rem', overflow: 'hidden', boxSizing: 'border-box' }}>
              <img src={modalFoto.imagenReferencia} alt="Referencia" style={{ maxWidth: '100%', maxHeight: '260px', width: 'auto', height: 'auto', objectFit: 'contain', borderRadius: '12px', display: 'block', margin: '0 auto' }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderDetailsModal;