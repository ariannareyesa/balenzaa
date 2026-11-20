import React from 'react';

function CareGuide() {
  return (
    <section id="cuidados" className="seccion-cuidados">
      <div className="contenedor-cuidados">
        <div className="encabezado-seccion">
          <span className="subtitulo-seccion">Conserva tus piezas</span>
          <h2 className="titulo-seccion">Guía de Cuidados</h2>
          <p className="bajada-seccion">Pautas esenciales para mantener tus tejidos en óptimo estado con el paso del tiempo.</p>
        </div>
        <div className="grilla-cuidados">
          <div className="tarjeta-cuidado">
            <h3>Lavado a mano</h3>
            <p>Lavar con agua fría y jabón suave. Evitar frotar con fuerza para no alterar los puntos del tejido.</p>
          </div>
          <div className="tarjeta-cuidado">
            <h3>Sin lavadora ni secadora</h3>
            <p>No usar ciclos mecánicos ni centrifugado para evitar deformaciones en el relleno o las fibras.</p>
          </div>
          <div className="tarjeta-cuidado">
            <h3>Secado en plano</h3>
            <p>Dejar secar sobre una toalla a la sombra en posición horizontal, sin colgar.</p>
          </div>
          <div className="tarjeta-cuidado">
            <h3>Sin planchado directo</h3>
            <p>No aplicar calor directo de plancha sobre el hilo ni exponer al sol prolongado.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CareGuide;