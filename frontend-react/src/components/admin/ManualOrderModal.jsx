import React from 'react';

function ManualOrderModal({ isOpen, onClose, manual, setManual, onSubmit }) {
  if (!isOpen) return null;

  return (
    <div style={{ display: 'flex', position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', zIndex: 9999, alignItems: 'center', justifyContent: 'center', padding: '1.5rem', boxSizing: 'border-box' }}>
      <div style={{ background: 'white', borderRadius: '28px', padding: '2rem', maxWidth: '500px', width: '100%', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', boxSizing: 'border-box' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '1.2rem', fontWeight: 'bold', color: '#C93A5B', cursor: 'pointer', padding: '4px 8px', lineHeight: 1 }}>✕</button>
        <h3 style={{ fontFamily: 'var(--f-titulo)', color: '#F2678A', margin: '0 0 1.2rem 0', fontSize: '1.5rem' }}>Registrar Encargo Manual</h3>
        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
          <div className="grupo-campo" style={{ margin: 0 }}>
            <label>Nombre del cliente *</label>
            <input type="text" required value={manual.nombre} onChange={e => setManual({...manual, nombre: e.target.value})} placeholder="Nombre completo" />
          </div>
          <div className="grupo-campo" style={{ margin: 0 }}>
            <label>Correo electrónico *</label>
            <input type="email" required value={manual.correo} onChange={e => setManual({...manual, correo: e.target.value})} placeholder="correo@ejemplo.com" />
          </div>
          <div className="grupo-campo" style={{ margin: 0 }}>
            <label>Celular / WhatsApp *</label>
            <input type="text" required value={manual.celular} onChange={e => setManual({...manual, celular: e.target.value})} placeholder="0999999999" maxLength="10" />
          </div>
          <div className="grupo-campo" style={{ margin: 0 }}>
            <label>Tipo de pieza *</label>
            <select value={manual.producto} onChange={e => setManual({...manual, producto: e.target.value})} style={{ width: '100%', padding: '0.7rem', borderRadius: '18px', border: '1.5px solid #FBC5D6' }}>
              <option value="Amigurumis">Amigurumis</option>
              <option value="Llaveros">Llaveros</option>
              <option value="Ramos de Flores">Ramos de Flores</option>
              <option value="Diseño especial">Diseño personalizado / Otro</option>
            </select>
          </div>
          <div className="grupo-campo" style={{ margin: 0 }}>
            <label>Detalles del pedido *</label>
            <textarea rows="2" required value={manual.detalles} onChange={e => setManual({...manual, detalles: e.target.value})} placeholder="Colores, observaciones..."></textarea>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label>Fecha de entrega *</label>
              <input type="date" required value={manual.fechaEntrega} onChange={e => setManual({...manual, fechaEntrega: e.target.value})} />
            </div>
            <div style={{ flex: 1 }}>
              <label>Precio total (USD)</label>
              <input type="number" step="0.50" min="0" value={manual.precioTotal} onChange={e => setManual({...manual, precioTotal: Math.max(0, parseFloat(e.target.value) || 0)})} placeholder="$0.00" />
            </div>
          </div>
          <button type="submit" style={{ width: '100%', backgroundColor: '#F2678A', color: '#fff', borderRadius: '999px', border: 'none', padding: '0.7rem', fontWeight: 700, cursor: 'pointer' }}>Guardar Encargo</button>
        </form>
      </div>
    </div>
  );
}

export default ManualOrderModal;