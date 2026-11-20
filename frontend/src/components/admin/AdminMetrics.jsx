import React from 'react';

function AdminMetrics({ 
  agendaCerrada, 
  toggleAgenda, 
  onOpenSubscribers, 
  pendientes, 
  elaboracion, 
  completados, 
  totalIngresos 
}) {
  return (
    <>
      <div className="barra-estado-agenda">
        <div className="info-sesion">
          <p>Bienvenida, <strong>Romina</strong></p>
        </div>
        <div className="control-agenda" style={{ gap: '0.8rem', flexWrap: 'wrap' }}>
          <span>Estado de la agenda:</span>
          <button 
            onClick={toggleAgenda} 
            className={`boton-agenda ${!agendaCerrada ? 'activa' : ''}`} 
            style={{ backgroundColor: agendaCerrada ? '#F8D7DA' : '#C3E6CB', color: agendaCerrada ? '#721C24' : '#155724' }}
          >
            {agendaCerrada ? 'Agenda Cerrada' : 'Agenda Abierta'}
          </button>
          <button 
            onClick={onOpenSubscribers} 
            className="boton-primario" 
            style={{ fontSize: '0.85rem', padding: '0.4rem 1.1rem', backgroundColor: 'var(--azul)', color: 'var(--azul-texto)', borderRadius: 'var(--radio-pill)', border: 'none', cursor: 'pointer', fontWeight: 700 }}
          >
            Club Balenzaa
          </button>
        </div>
      </div>

      <section className="seccion-metricas">
        <div className="tarjeta-metrica">
          <h3>Pedidos Pendientes</h3>
          <p className="valor-metrica">{pendientes}</p>
        </div>
        <div className="tarjeta-metrica">
          <h3>En Elaboración</h3>
          <p className="valor-metrica">{elaboracion}</p>
        </div>
        <div className="tarjeta-metrica">
          <h3>Total Completados</h3>
          <p className="valor-metrica">{completados}</p>
        </div>
        <div className="tarjeta-metrica" style={{ backgroundColor: 'var(--rosa-pastel)' }}>
          <h3>Total</h3>
          <p className="valor-metrica" style={{ fontSize: '2.4rem' }}>${totalIngresos.toFixed(2)}</p>
        </div>
      </section>
    </>
  );
}

export default AdminMetrics;