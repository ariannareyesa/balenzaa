import React from 'react';

function Footer() {
  return (
    <footer className="pie-pagina">
      <div className="contenedor-pie">
        <div className="columna-pie">
          <span className="nombre-marca">Balenzaa</span>
          <p className="lema-pie">"Un toque dulce, un hilo de amor"</p>
          <p className="ubicacion-pie" style={{ fontSize: '0.85rem' }}>Guayaquil, Ecuador</p>
        </div>

        <div className="columna-pie">
          <h4>Navegación</h4>
          <ul className="enlaces-pie">
            <li><a href="#inicio">Inicio</a></li>
            <li><a href="#sobre-mi">Sobre mí</a></li>
            <li><a href="#catalogo">Catálogo</a></li>
            <li><a href="#cuidados">Cuidados</a></li>
            <li><a href="#preguntas">Preguntas</a></li>
          </ul>
        </div>

        <div className="columna-pie">
          <h4>Contacto</h4>
          <p><a href="https://instagram.com/balenzaa" target="_blank" rel="noopener noreferrer">Instagram</a></p>
          <p><a href="https://wa.me/593983462196" target="_blank" rel="noopener noreferrer">WhatsApp</a></p>
        </div>
      </div>

      <div className="barra-derechos">
        <p>&copy; 2026 <a href="#admin" className="enlace-oculto-admin">Balenzaa</a>. | Desarrollado por <a href="https://github.com/ariannareyesa" target="_blank" rel="noopener noreferrer">Arianna Reyes</a></p>
      </div>
    </footer>
  );
}

export default Footer;