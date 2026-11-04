import React from 'react';

function About() {
  return (
    <section id="sobre-mi" className="seccion-sobre-mi">
      <div className="contenedor-sobre-mi">
        <div className="imagen-sobre-mi">
          <img src="/images/romina.jpg" alt="Romina Reyes creadora de balenzaa" onError={(e) => e.target.style.display='none'} />
          <img src="/images/flecha.png" alt="" className="doodle-flecha-romina" />
          <div className="cuadro-decorativo"></div>
        </div>
        <div className="texto-sobre-mi">
          <span className="subtitulo-seccion">Conoce a la creadora</span>
          <h2 className="titulo-seccion">El corazón detrás de Balenzaa</h2>
          <p>¡Hola! Soy Romina Reyes, la creadora de Balenzaa.</p>
          <p>Todo lo que ves aquí se teje bajo pedido, sin prisas y cuidando cada puntada para que te lleves un recuerdo especial, ya sea un regalo para alguien querido o un detalle para ti.</p>
          <div className="detalles-marca">
            <div className="item-detalle">
              <span className="numero-detalle">100%</span>
              <span className="etiqueta-detalle">Artesanal</span>
            </div>
            <div className="item-detalle">
              <span className="numero-detalle">Bajo pedido</span>
              <span className="etiqueta-detalle">Personalizado</span>
            </div>
            <div className="item-detalle">
              <span className="numero-detalle">Guayaquil</span>
              <span className="etiqueta-detalle">Entregas locales</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;