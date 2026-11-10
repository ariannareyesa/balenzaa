import React from 'react';

function SubscribersModal({ isOpen, onClose, suscriptores, exportarClubCsv, mostrarToast }) {
  if (!isOpen) return null;

  return (
    <div style={{ display: 'flex', position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', zIndex: 9999, alignItems: 'center', justifyContent: 'center', padding: '1.5rem', boxSizing: 'border-box' }}>
      <div style={{ background: 'white', borderRadius: '28px', padding: '2rem', maxWidth: '500px', width: '100%', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', boxSizing: 'border-box' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '1.2rem', fontWeight: 'bold', color: '#C93A5B', cursor: 'pointer', padding: '4px 8px', lineHeight: 1 }}>✕</button>
        <h3 style={{ fontFamily: 'var(--f-titulo)', color: '#F2678A', margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>Miembros Club Balenzaa</h3>
        <p style={{ fontSize: '0.88rem', color: '#74404F', marginBottom: '1.2rem' }}>Lista de correos de clientes registrados en el club para enviar novedades.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', maxHeight: '50vh', overflowY: 'auto', marginBottom: '1.2rem', border: '1.5px solid #FBC5D6', borderRadius: '16px', padding: '1rem', background: '#FFF7FA' }}>
          {suscriptores.length === 0 ? (
            <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#74404F' }}>No hay suscriptores registrados aún.</p>
          ) : (
            suscriptores.map((p, i) => (
              <div key={i} style={{ background: 'white', padding: '0.6rem 0.9rem', borderRadius: '10px', border: '1.5px solid #FBC5D6', fontSize: '0.88rem' }}>
                <strong>{p.nombre || 'Cliente'}</strong>: <a href={`mailto:${p.correo}`} style={{ color: '#F2678A', textDecoration: 'underline' }}>{p.correo}</a>
              </div>
            ))
          )}
        </div>
        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
          <button 
            onClick={async () => {
              if (suscriptores.length === 0) { mostrarToast('No hay correos para copiar.', 'error'); return; }
              const lista = suscriptores.map(s => s.correo.trim()).join(', ');
              try {
                await navigator.clipboard.writeText(lista);
                mostrarToast('¡Correos copiados al portapapeles!', 'exito');
              } catch (err) { mostrarToast('Error al copiar.', 'error'); }
            }} 
            style={{ backgroundColor: '#F2678A', color: '#fff', flex: 1, textAlign: 'center', fontSize: '0.85rem', padding: '0.7rem 1rem', borderRadius: '999px', border: 'none', fontWeight: 700, cursor: 'pointer' }}
          >
            Copiar todos
          </button>
          <button 
            onClick={exportarClubCsv} 
            style={{ backgroundColor: '#A9D3EC', color: '#3E6C8F', flex: 1, textAlign: 'center', fontSize: '0.85rem', padding: '0.7rem 1rem', borderRadius: '999px', border: 'none', fontWeight: 700, cursor: 'pointer' }}
          >
            Descargar CSV
          </button>
        </div>
      </div>
    </div>
  );
}

export default SubscribersModal;