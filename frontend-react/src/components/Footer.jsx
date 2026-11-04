import React from 'react';

function Footer() {
  return (
    <footer className="pie-pagina" style={{ background: 'var(--rosa-pastel)', padding: '2rem 1rem', textAlign: 'center', marginTop: '3rem', borderTop: '1.5px solid var(--rosa-claro)' }}>
      <div className="contenedor-footer" style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
        <p style={{ margin: 0, fontWeight: 700, color: 'var(--tinta)' }}>Balenzaa · Crochet artesanal en Guayaquil, Ecuador</p>
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--tinta)', opacity: 0.8 }}>Hecho con amor y dedicación bajo pedido.</p>
      </div>
    </footer>
  );
}

export default Footer;