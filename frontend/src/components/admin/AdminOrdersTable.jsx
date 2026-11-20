import React from 'react';

function AdminOrdersTable({
  pedidosFiltrados,
  tiposDisponibles,
  estadoFiltro,
  setEstadoFiltro,
  mesFiltro,
  setMesFiltro,
  tipoFiltro,
  setTipoFiltro,
  formatearFechaTexto,
  renderizarNombreCliente,
  formatearTiempo,
  onOpenModalFoto,
  onUpdatePrecio,
  onUpdateEstado,
  onToggleCronometro,
  onResetCronometro,
  onDeletePedido,
  exportarPedidosCsv,
  onOpenModalManual
}) {
  return (
    <section className="seccion-gestion-pedidos">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ color: 'var(--rosa)', fontSize: '2rem', margin: 0 }}>Gestión de Encargos</h2>
        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
          <button onClick={exportarPedidosCsv} style={{ fontSize: '0.85rem', padding: '0.5rem 1.2rem', backgroundColor: '#B8D82B', color: '#fff', cursor: 'pointer', border: 'none', borderRadius: 'var(--radio-pill)', fontWeight: 700 }}>Exportar Pedidos CSV</button>
          <button onClick={onOpenModalManual} style={{ fontSize: '0.85rem', padding: '0.5rem 1.2rem', backgroundColor: '#F2678A', color: '#fff', borderRadius: 'var(--radio-pill)', border: 'none', cursor: 'pointer', fontWeight: 700 }}>+ Nuevo Encargo Manual</button>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.2rem', background: '#FFF7FA', padding: '1rem 1.2rem', borderRadius: '18px', border: '1.5px solid #FBC5D6' }}>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap', borderBottom: '1.5px solid #FBC5D6', paddingBottom: '0.8rem' }}>
          <span style={{ fontWeight: 700, color: '#F2678A', fontSize: '0.92rem', marginRight: '0.5rem' }}>Estado:</span>
          {[
            { id: 'todos', label: 'Todos' },
            { id: 'Pendiente', label: 'Pendientes' },
            { id: 'En elaboración', label: 'En elaboración' },
            { id: 'Completado', label: 'Completados' }
          ].map(est => (
            <button 
              key={est.id} 
              onClick={() => setEstadoFiltro(est.id)} 
              style={{ padding: '0.4rem 1rem', borderRadius: '999px', border: '1.5px solid #FBC5D6', background: estadoFiltro === est.id ? '#F2678A' : '#fff', color: estadoFiltro === est.id ? '#fff' : '#74404F', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
            >
              {est.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'nowrap', overflowX: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, margin: 0, color: '#74404F' }}>Mes:</label>
            <select value={mesFiltro} onChange={e => setMesFiltro(e.target.value)} style={{ padding: '6px 12px', borderRadius: '10px', border: '1.5px solid #FBC5D6', fontSize: '0.85rem', background: '#fff', color: '#74404F', outline: 'none' }}>
              <option value="todos">Todos los meses</option>
              <option value="1">Enero</option><option value="2">Febrero</option><option value="3">Marzo</option>
              <option value="4">Abril</option><option value="5">Mayo</option><option value="6">Junio</option>
              <option value="7">Julio</option><option value="8">Agosto</option><option value="9">Septiembre</option>
              <option value="10">Octubre</option><option value="11">Noviembre</option><option value="12">Diciembre</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, margin: 0, color: '#74404F' }}>Tipo de pieza:</label>
            <select value={tipoFiltro} onChange={e => setTipoFiltro(e.target.value)} style={{ padding: '6px 12px', borderRadius: '10px', border: '1.5px solid #FBC5D6', fontSize: '0.85rem', background: '#fff', color: '#74404F', outline: 'none', minWidth: '220px' }}>
              <option value="todos">Todas las piezas</option>
              {tiposDisponibles.map((t, idx) => (
                <option key={idx} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de Pedidos */}
      <div className="contenedor-tabla" style={{ maxHeight: '400px', overflowY: 'auto' }}>
        <table className="tabla-pedidos" style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px', fontSize: '0.9rem', minWidth: '850px' }}>
          <thead>
            <tr>
              <th style={{ color: '#F2678A', padding: '0.5rem 0.8rem', fontSize: '0.8rem', textAlign: 'left' }}>FECHA</th>
              <th style={{ color: '#F2678A', padding: '0.5rem 0.8rem', fontSize: '0.8rem', textAlign: 'left' }}>CLIENTE</th>
              <th style={{ color: '#F2678A', padding: '0.5rem 0.8rem', fontSize: '0.8rem', textAlign: 'left' }}>CORREO</th>
              <th style={{ color: '#F2678A', padding: '0.5rem 0.8rem', fontSize: '0.8rem', textAlign: 'left' }}>CELULAR</th>
              <th style={{ color: '#F2678A', padding: '0.5rem 0.8rem', fontSize: '0.8rem', textAlign: 'left' }}>PIEZA</th>
              <th style={{ color: '#F2678A', padding: '0.5rem 0.8rem', fontSize: '0.8rem', textAlign: 'left' }}>ENTREGA</th>
              <th style={{ color: '#F2678A', padding: '0.5rem 0.8rem', fontSize: '0.8rem', textAlign: 'left' }}>PRECIO</th>
              <th style={{ color: '#F2678A', padding: '0.5rem 0.8rem', fontSize: '0.8rem', textAlign: 'left' }}>ESTADO</th>
              <th style={{ color: '#F2678A', padding: '0.5rem 0.8rem', fontSize: '0.8rem', textAlign: 'left' }}>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {pedidosFiltrados.length === 0 ? (
              <tr><td colSpan="9" style={{ textAlign: 'center', padding: '1.5rem' }}>No hay encargos registrados con este filtro.</td></tr>
            ) : (
              pedidosFiltrados.map((p, idx) => {
                const idPedido = p._id || idx;
                const enlaceWs = p.celular ? `https://wa.me/593${p.celular.replace(/^0/, '')}` : '#';
                const precioVal = parseFloat(p.precioTotal);
                const esCeroOvacio = isNaN(precioVal) || precioVal === 0;

                return (
                  <tr key={idPedido}>
                    <td style={{ backgroundColor: '#FFF6EC', padding: '0.8rem', whiteSpace: 'nowrap', borderRadius: '16px 0 0 16px' }}>{formatearFechaTexto(p.fechaCreacion)}</td>
                    <td style={{ backgroundColor: '#FFF6EC', padding: '0.8rem', whiteSpace: 'nowrap' }}>
                      {renderizarNombreCliente(p.nombre)}
                    </td>
                    <td style={{ backgroundColor: '#FFF6EC', padding: '0.8rem' }}>{p.correo}</td>
                    <td style={{ backgroundColor: '#FFF6EC', padding: '0.8rem', whiteSpace: 'nowrap' }}>
                      {p.celular ? <a href={enlaceWs} target="_blank" rel="noopener noreferrer" style={{ color: '#2F6224', fontWeight: 700, textDecoration: 'underline' }}>{p.celular}</a> : '-'}
                    </td>
                    <td style={{ backgroundColor: '#FFF6EC', padding: '0.8rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontWeight: 600, color: '#74404F', whiteSpace: 'nowrap' }}>{p.producto}</span>
                        {(p.detalles || p.imagenReferencia) && (
                          <button onClick={() => onOpenModalFoto(p)} style={{ background: 'none', border: 'none', color: '#F2678A', fontWeight: 700, cursor: 'pointer', padding: 0, fontSize: '0.78rem', textAlign: 'left', textDecoration: 'underline' }}>Ver detalles</button>
                        )}
                      </div>
                    </td>
                    <td style={{ backgroundColor: '#FFF6EC', padding: '0.8rem', whiteSpace: 'nowrap' }}>{formatearFechaTexto(p.fechaEntrega)}</td>
                    
                    <td style={{ backgroundColor: '#FFF6EC', padding: '0.8rem', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', background: '#fff', border: '1.5px solid #FBC5D6', borderRadius: '14px', padding: '5px 10px', width: '90px', boxSizing: 'border-box' }}>
                        <span style={{ fontWeight: 700, color: '#74404F', marginRight: '1px', fontSize: '0.9rem', opacity: esCeroOvacio ? '0.5' : '1' }}>$</span>
                        <input 
                          type="text" 
                          defaultValue={!esCeroOvacio ? precioVal.toFixed(2) : '0.00'}
                          onFocus={(e) => { if (e.target.value === '0.00') e.target.value = ''; }}
                          onBlur={(e) => onUpdatePrecio(p._id, e.target.value)}
                          style={{ 
                            width: '100%', 
                            border: 'none', 
                            fontWeight: 700, 
                            textAlign: 'left', 
                            fontSize: '0.9rem', 
                            outline: 'none', 
                            background: 'transparent', 
                            color: '#74404F', 
                            padding: 0,
                            opacity: esCeroOvacio ? '0.5' : '1' 
                          }}
                        />
                      </div>
                    </td>

                    <td style={{ backgroundColor: '#FFF6EC', padding: '0.8rem', whiteSpace: 'nowrap' }}>
                      <select 
                        value={p.estado || 'Pendiente'}
                        onChange={(e) => onUpdateEstado(p._id, e.target.value)}
                        style={{ padding: '5px 10px', borderRadius: '12px', border: '1.5px solid #FBC5D6', background: '#fff', fontSize: '0.85rem', color: '#74404F', outline: 'none', width: 'auto', minWidth: '130px', cursor: 'pointer' }}
                      >
                        <option value="Pendiente">Pendiente</option>
                        <option value="En elaboración">En elaboración</option>
                        <option value="Completado">Completado</option>
                      </select>
                    </td>

                    <td style={{ backgroundColor: '#FFF6EC', padding: '0.8rem', whiteSpace: 'nowrap', borderRadius: '0 16px 16px 0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: '#fff', padding: '3px 8px', borderRadius: '999px', border: '1.5px solid #FBC5D6' }}>
                          <span style={{ fontFamily: 'monospace', fontSize: '0.82rem', fontWeight: 700, color: '#74404F', minWidth: '58px', textAlign: 'center' }}>
                            {formatearTiempo(p.segundosTejidos)}
                          </span>
                          <button 
                            onClick={() => onToggleCronometro(p)}
                            title={p.cronometroActivo ? 'Pausar' : 'Iniciar'}
                            style={{ background: p.cronometroActivo ? '#FFD45C' : '#F2678A', color: p.cronometroActivo ? '#74404F' : '#fff', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 'bold', cursor: 'pointer' }}
                          >
                            {p.cronometroActivo ? '❚❚' : '▶'}
                          </button>
                          <button 
                            onClick={() => onResetCronometro(p)}
                            title="Reiniciar"
                            style={{ background: 'none', border: 'none', color: '#999', fontSize: '0.85rem', cursor: 'pointer', padding: '0 2px' }}
                          >
                            ↺
                          </button>
                        </div>
                        <button 
                          onClick={() => onDeletePedido(p._id)}
                          title="Eliminar"
                          style={{ background: 'none', border: 'none', color: '#C93A5B', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem', padding: '0 4px' }}
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default AdminOrdersTable;