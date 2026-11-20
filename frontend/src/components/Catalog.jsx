import React, { useState, useEffect } from 'react';

function Catalog({ onAddToCart }) {
  const [productos, setProductos] = useState([]);
  const [filtroActivo, setFiltroActivo] = useState('todos');
  const [agendaCerrada, setAgendaCerrada] = useState(false);
  
  // Estado para la notificación flotante (toast)
  const [toastCatalogo, setToastCatalogo] = useState(null);

  const mostrarToastCatalogo = (mensaje, tipo = 'exito') => {
    setToastCatalogo({ mensaje, tipo });
    setTimeout(() => {
      setToastCatalogo(null);
    }, 3500);
  };

  useEffect(() => {
    // Verificar estado de la agenda
    const cerrada = localStorage.getItem('balenzaa_agenda_cerrada') === 'true';
    setAgendaCerrada(cerrada);

    // Obtener productos desde la API o localStorage
    async function cargarProductos() {
      try {
        const respuesta = await fetch('/api/productos');
        if (respuesta.ok) {
          const datos = await respuesta.json();
          if (datos.length > 0) {
            setProductos(datos);
            return;
          }
        }
      } catch (error) {
        console.error('Error al cargar productos:', error);
      }
      const guardado = localStorage.getItem('balenzaa_catalogo');
      if (guardado) {
        setProductos(JSON.parse(guardado));
      }
    }
    cargarProductos();
  }, []);

  // Obtener categorías únicas
  const categoriasBase = ['Amigurumis', 'Llaveros', 'Ramos de Flores'];
  const categoriasSet = new Set(categoriasBase);
  const ignoradas = ['general', 'sin categoria', 'estandar'];

  productos.forEach(p => {
    if (p.categoria) {
      const cat = p.categoria.trim();
      if (!ignoradas.includes(cat.toLowerCase())) {
        categoriasSet.add(cat.charAt(0).toUpperCase() + cat.slice(1));
      }
    }
  });

  const categorias = ['todos', ...Array.from(categoriasSet)];

  const productosFiltrados = productos.filter(p => {
    if (filtroActivo === 'todos') return true;
    const catProd = (p.categoria || '').trim().toLowerCase();
    return catProd === filtroActivo.toLowerCase();
  });

  return (
    <section id="catalogo" className="seccion-catalogo">
      {/* Notificación flotante de catálogo */}
      {toastCatalogo && (
        <div className={`toast-notificacion ${toastCatalogo.tipo} visible`} style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 10005 }}>
          {toastCatalogo.mensaje}
        </div>
      )}

      <div className="contenedor-catalogo">
        <div className="encabezado-seccion">
          <span className="subtitulo-seccion">Nuestras Creaciones</span>
          <h2 className="titulo-seccion">Catálogo</h2>
          <p className="bajada-seccion">Piezas tejidas a mano bajo pedido. Precios y detalles referenciales según especificaciones del cliente.</p>
        </div>

        {/* Indicador de Agenda */}
        <div 
          id="banner-estado-agenda" 
          className={agendaCerrada ? 'agenda-cerrada' : 'agenda-abierta'}
          style={{ 
            textAlign: 'center', 
            marginBottom: '1.2rem', 
            fontWeight: 700, 
            fontSize: '0.9rem',
            color: agendaCerrada ? '#721C24' : '#155724' 
          }}
        >
          {agendaCerrada ? 'Agenda cerrada por el momento' : 'Agenda abierta'}
        </div>

        {/* Botones de Filtro */}
        <div className="contenedor-filtros">
          {categorias.map(cat => (
            <button
              key={cat}
              className={`boton-filtro ${filtroActivo === cat.toLowerCase() ? 'activo' : ''}`}
              onClick={() => setFiltroActivo(cat.toLowerCase())}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Grilla de Productos */}
        <div className="grilla-productos">
          {productosFiltrados.length === 0 ? (
            <p style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '2rem' }}>No hay productos en esta categoría.</p>
          ) : (
            productosFiltrados.map((prod, idx) => (
              <article key={prod._id || idx} className="tarjeta-producto" data-categoria={(prod.categoria || '').trim().toLowerCase()}>
                <div className="imagen-producto">
                  <img src={prod.imagen} alt={prod.nombre} onError={(e) => e.target.src = 'images/amigurumi.jpg'} />
                  {prod.categoria && prod.categoria.trim().toLowerCase() !== 'general' && (
                    <span className="etiqueta-categoria">{prod.categoria}</span>
                  )}
                </div>
                <div className="info-producto">
                  <h3 className="nombre-producto">{prod.nombre}</h3>
                  <p className="descripcion-producto">{prod.descripcion}</p>
                  <div className="pie-tarjeta" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '0.8rem' }}>
                    <div className="contenedor-precio-referencial">
                      <span style={{ fontSize: '0.75rem', color: 'var(--tinta)', display: 'block', opacity: 0.8 }}>Precio referencial:</span>
                      <span className="precio-producto" style={{ fontWeight: 700, color: 'var(--rosa)', fontSize: '1.05rem' }}>
                        ${parseFloat(prod.precio || 0).toFixed(2)}
                      </span>
                    </div>
                    <button 
                      className="boton-agregar-carrito boton-encargar-tarjeta" 
                      onClick={() => {
                        onAddToCart(prod);
                        mostrarToastCatalogo(`¡"${prod.nombre}" se agregó al carrito! ✿`, 'exito');
                      }}
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default Catalog;