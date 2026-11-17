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
    <header className="barra-navegacion" style={{ position: 'relative' }}>
      <div className="contenedor-nav" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', padding: '0.8rem 1rem' }}>
        
        {/* Fila superior: Logo y Hamburguesa a la extrema derecha */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          {/* Logo de la marca */}
          <a href="#inicio" className="logotipo-marca" onClick={cerrarMenu} style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <img src="/images/logo_balenzaa.png" alt="Logo Balenzaa" className="imagen-logo-nav" />
            <span style={{ fontFamily: 'var(--f-titulo)', color: 'var(--rosa)', fontSize: '1.4rem' }}>Balenzaa</span>
          </a>

          {/* Botón de Hamburguesa a la extrema derecha */}
          <button 
            className="menu-hamburguesa" 
            onClick={toggleMenu}
            aria-label="Abrir menú"
            style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', gap: '5px', background: 'none', border: 'none', cursor: 'pointer', padding: '5px' }}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {/* Menú de Navegación desplegable */}
        <nav style={{ width: '100%' }}>
          <ul className={`menu-navegacion ${menuAbierto ? 'activo' : ''}`} id="menuNavegacion" style={{ width: '100%' }}>
            <li><a href="#inicio" onClick={cerrarMenu}>Inicio</a></li>
            <li><a href="#sobre-mi" onClick={cerrarMenu}>Sobre mí</a></li>
            <li><a href="#catalogo" onClick={cerrarMenu}>Catálogo</a></li>
            <li><a href="#cuidados" onClick={cerrarMenu}>Cuidados</a></li>
            <li><a href="#preguntas" onClick={cerrarMenu}>Preguntas</a></li>
          </ul>
        </nav>

        {/* Fila inferior: Carrito y CTA de encargo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '0.5rem', paddingTop: '0.2rem' }}>
          <button 
            id="boton-abrir-carrito" 
            onClick={onOpenCart}
            className="boton-carrito-nav" 
            style={{ position: 'relative', background: 'var(--rosa-pastel)', border: '1.5px solid var(--rosa-claro)', borderRadius: 'var(--radio-pill)', padding: '0.35rem 0.8rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.82rem', color: 'var(--tinta)' }}
          >
            🛒 <span id="contador-carrito" style={{ background: 'var(--rosa)', color: '#fff', borderRadius: '50%', width: '18px', height: '18px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>{cartCount || 0}</span>
          </button>
          
          <button onClick={onOpenModal} className="boton-nav-cta" style={{ flex: 1, textAlign: 'center' }}>
            Encargo personalizado
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;