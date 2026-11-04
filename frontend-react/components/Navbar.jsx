import React from 'react';

function Navbar({ onOpenCart, onOpenModal }) {
  return (
    <header className="barra-navegacion">
      <div className="contenedor-nav">
        <a href="#inicio" className="logotipo-marca">
          <img src="/images/logo_balenzaa.png" alt="Logo Balenzaa" className="imagen-logo-nav" />
          <span>Balenzaa</span>
        </a>

        <nav>
          <ul className="menu-navegacion" id="menuNavegacion">
            <li><a href="#inicio">Inicio</a></li>
            <li><a href="#sobre-mi">Sobre mí</a></li>
            <li><a href="#catalogo">Catálogo</a></li>
            <li><a href="#cuidados">Cuidados</a></li>
            <li><a href="#preguntas">Preguntas</a></li>
          </ul>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <button 
            id="boton-abrir-carrito" 
            onClick={onOpenCart}
            className="boton-carrito-nav" 
            style={{ position: 'relative', background: 'var(--rosa-pastel)', border: '1.5px solid var(--rosa-claro)', borderRadius: 'var(--radio-pill)', padding: '0.35rem 0.8rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.82rem', color: 'var(--tinta)' }}
          >
            🛒 <span id="contador-carrito" style={{ background: 'var(--rosa)', color: '#fff', borderRadius: '50%', width: '18px', height: '18px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>0</span>
          </button>
          <button onClick={onOpenModal} className="boton-nav-cta">Encargo</button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;