import React, { useState } from 'react';

function Navbar({ cartCount, onOpenCart, onOpenModal }) {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  const cerrarMenu = () => {
    setMenuAbierto(false);
  };

  return (
    <header className="barra-navegacion">
      <div className="contenedor-nav">
        
        {/* Logo de la marca */}
        <a href="#inicio" className="logotipo-marca" onClick={cerrarMenu}>
          <img src="/images/logo_balenzaa.png" alt="Logo Balenzaa" className="imagen-logo-nav" />
          <span>Balenzaa</span>
        </a>

        {/* Botón de Hamburguesa exacto para que el CSS original lo active en móvil */}
        <button 
          className="menu-hamburguesa" 
          onClick={toggleMenu}
          aria-label="Abrir menú"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Menú de Navegación */}
        <nav>
          <ul className={`menu-navegacion ${menuAbierto ? 'activo' : ''}`} id="menuNavegacion">
            <li><a href="#inicio" onClick={cerrarMenu}>Inicio</a></li>
            <li><a href="#sobre-mi" onClick={cerrarMenu}>Sobre mí</a></li>
            <li><a href="#catalogo" onClick={cerrarMenu}>Catálogo</a></li>
            <li><a href="#cuidados" onClick={cerrarMenu}>Cuidados</a></li>
            <li><a href="#preguntas" onClick={cerrarMenu}>Preguntas</a></li>
          </ul>
        </nav>

        {/* Acciones de la derecha (Carrito y CTA) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <button 
            id="boton-abrir-carrito" 
            onClick={onOpenCart}
            className="boton-carrito-nav" 
            style={{ position: 'relative', background: 'var(--rosa-pastel)', border: '1.5px solid var(--rosa-claro)', borderRadius: 'var(--radio-pill)', padding: '0.35rem 0.8rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.82rem', color: 'var(--tinta)' }}
          >
            🛒 <span id="contador-carrito" style={{ background: 'var(--rosa)', color: '#fff', borderRadius: '50%', width: '18px', height: '18px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>{cartCount || 0}</span>
          </button>
          <button onClick={onOpenModal} className="boton-nav-cta">Encargo personalizado</button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;