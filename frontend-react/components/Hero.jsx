import React from 'react';

function Hero({ onOpenModal }) {
  return (
    <section id="inicio" className="seccion-hero">
      <div className="contenedor-hero">
        <span className="insignia-artesanal">Hecho a mano en Guayaquil</span>
        <h1 className="titulo-hero">Un toque dulce, un hilo de amor.</h1>
        <p className="descripcion-hero">Piezas en crochet diseñadas puntada a puntada. Amigurumis, flores eternas y detalles personalizados para regalar con sentido.</p>
        <div className="botones-hero">
          <a href="#catalogo" className="boton-primario">Ver catálogo</a>
          <button onClick={onOpenModal} className="boton-secundario" style={{ cursor: 'pointer' }}>Encargo personalizado</button>
        </div>
      </div>
    </section>
  );
}

export default Hero;