import React from 'react';

function AdminCatalog({
  productos,
  onDeleteProducto,
  onUpdateProductoField,
  onOpenModalNuevoProd
}) {
  return (
    <section className="seccion-catalogo-admin" style={{ backgroundColor: 'var(--blanco)', borderRadius: '32px', padding: '2rem', marginTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ color: 'var(--rosa)', fontSize: '2rem', margin: 0 }}>Catálogo Actual</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--tinta)', marginTop: '0.3rem' }}>Vista previa en vivo de las piezas disponibles en la tienda. Haz clic en los textos para editarlos.</p>
        </div>
        <button onClick={onOpenModalNuevoProd} className="boton-primario" style={{ fontSize: '0.85rem', padding: '0.6rem 1.4rem', backgroundColor: 'var(--rosa)', color: '#fff', borderRadius: 'var(--radio-pill)', border: 'none', cursor: 'pointer', fontWeight: 700 }}>+ Agregar Nueva Pieza</button>
      </div>

      <div className="grilla-productos" id="contenedor-catalogo-admin" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.2rem' }}>
        {productos.map(prod => (
          <article key={prod._id} className="tarjeta-producto" style={{ position: 'relative' }}>
            <button 
              onClick={() => onDeleteProducto(prod._id)} 
              style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10, background: 'white', border: 'none', borderRadius: '50%', width: '28px', height: '28px', color: '#C93A5B', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
            >
              ✕
            </button>
            <div className="imagen-producto">
              <img src={prod.imagen} alt={prod.nombre} />
              <span className="etiqueta-categoria">{prod.categoria}</span>
            </div>
            <div className="info-producto" style={{ padding: '0.8rem 1rem 1rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <h3 
                contentEditable 
                suppressContentEditableWarning 
                onBlur={(e) => onUpdateProductoField(prod._id, 'nombre', e.target.innerText.trim())}
                className="nombre-producto" 
                style={{ fontSize: '1rem', outline: 'none', cursor: 'text', margin: 0 }}
              >
                {prod.nombre}
              </h3>
              <p 
                contentEditable 
                suppressContentEditableWarning 
                onBlur={(e) => onUpdateProductoField(prod._id, 'descripcion', e.target.innerText.trim())}
                className="descripcion-producto" 
                style={{ fontSize: '0.82rem', outline: 'none', cursor: 'text', color: 'var(--tinta)', margin: 0 }}
              >
                {prod.descripcion}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.2rem', paddingTop: '0.3rem', borderTop: '1px solid #f0f0f0' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>Precio ($):</span>
                <input 
                  type="text" 
                  defaultValue={prod.precio !== undefined && prod.precio !== '' ? Math.max(0, parseFloat(prod.precio)).toFixed(2) : '0.00'}
                  onBlur={(e) => onUpdateProductoField(prod._id, 'precio', e.target.value)}
                  style={{ width: '75px', padding: '3px 6px', border: '1.5px solid var(--rosa-claro)', borderRadius: '8px', fontWeight: 700, textAlign: 'center', fontSize: '0.85rem' }} 
                />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default AdminCatalog;