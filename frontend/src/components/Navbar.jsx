import React, { useState } from 'react';

function Navbar({ cartCount, onOpenCart }) {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const toggleMenu = () => {
    setMenuAbierto((prev) => !prev);
  };

  const cerrarMenu = () => {
    setMenuAbierto(false);
  };

  return (
    <header className="barra-navegacion">
      <div className="contenedor-nav">
        <a href="#inicio" className="logotipo-marca" onClick={cerrarMenu}>
          <img src="/images/logo_balenzaa.png" alt="Logo Balenzaa" className="imagen-logo-nav" />
          <span>Balenzaa</span>
        </a>

        <nav className="navegacion-principal">
          <ul className={`menu-navegacion ${menuAbierto ? 'activo' : ''}`} id="menuNavegacion">
            <li><a href="#inicio" onClick={cerrarMenu}>Inicio</a></li>
            <li><a href="#sobre-mi" onClick={cerrarMenu}>Sobre mí</a></li>
            <li><a href="#catalogo" onClick={cerrarMenu}>Catálogo</a></li>
            <li><a href="#cuidados" onClick={cerrarMenu}>Cuidados</a></li>
            <li><a href="#preguntas" onClick={cerrarMenu}>Preguntas</a></li>
          </ul>
        </nav>

        <div className="acciones-nav-derecha">
          <button
            id="boton-abrir-carrito"
            type="button"
            onClick={() => {
              cerrarMenu();
              onOpenCart();
            }}
            className="boton-carrito-nav"
            style={{ position: 'relative', background: 'var(--rosa-pastel)', border: '1.5px solid var(--rosa-claro)', borderRadius: 'var(--radio-pill)', padding: '0.35rem 0.8rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.82rem', color: 'var(--tinta)' }}
          >
            🛒 <span id="contador-carrito" style={{ background: 'var(--rosa)', color: '#fff', borderRadius: '50%', width: '18px', height: '18px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>{cartCount || 0}</span>
          </button>

          <button
            type="button"
            className={`menu-hamburguesa ${menuAbierto ? 'abierto' : ''}`}
            onClick={toggleMenu}
            aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuAbierto}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;