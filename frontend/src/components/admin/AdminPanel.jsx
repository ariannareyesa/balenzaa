import React, { useState, useEffect } from 'react';
import AdminMetrics from './AdminMetrics';
import AdminOrdersTable from './AdminOrdersTable';
import AdminCatalog from './AdminCatalog';
import OrderDetailsModal from './modals/OrderDetailsModal';
import ManualOrderModal from './modals/ManualOrderModal';
import NewProductModal from './modals/NewProductModal';
import SubscribersModal from './modals/SubscribersModal';

function AdminPanel({ onBackToStore }) {
  const [token, setToken] = useState(localStorage.getItem('balenzaa_token') || '');
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [errorLogin, setErrorLogin] = useState('');

  const [pedidos, setPedidos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [agendaCerrada, setAgendaCerrada] = useState(localStorage.getItem('balenzaa_agenda_cerrada') === 'true');

  const [toast, setToast] = useState(null);

  const [confirmacionModal, setConfirmacionModal] = useState({
    visible: false,
    mensaje: '',
    onAceptar: null
  });

  const [estadoFiltro, setEstadoFiltro] = useState('todos');
  const [mesFiltro, setMesFiltro] = useState('todos');
  const [tipoFiltro, setTipoFiltro] = useState('todos');

  const [modalFoto, setModalFoto] = useState(null);
  const [modalSuscriptoresOpen, setModalSuscriptoresOpen] = useState(false);
  const [modalPedidoManualOpen, setModalPedidoManualOpen] = useState(false);
  const [modalNuevoProdOpen, setModalNuevoProdOpen] = useState(false);

  const [nuevoProd, setNuevoProd] = useState({ nombre: '', categoria: 'Amigurumis', precio: '', descripcion: '', imagen: '' });
  const [nombreFotoAdmin, setNombreFotoAdmin] = useState('Ningún archivo seleccionado');

  const [manual, setManual] = useState({ nombre: '', correo: '', celular: '', producto: 'Amigurumis', detalles: '', fechaEntrega: '', precioTotal: '', horas: 0, minutos: 0, estado: 'Pendiente' });

  const mostrarToast = (mensaje, tipo = 'exito') => {
    setToast({ mensaje, tipo });
    setTimeout(() => { setToast(null); }, 3500);
  };

  const solicitarConfirmacion = (mensaje, onAceptar) => {
    setConfirmacionModal({ visible: true, mensaje, onAceptar });
  };

  useEffect(() => {
    if (token) cargarDatosAdmin();
  }, [token]);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setPedidos(prevPedidos =>
        prevPedidos.map(p => {
          if (p.cronometroActivo) {
            return { ...p, segundosTejidos: (p.segundosTejidos || 0) + 1 };
          }
          return p;
        })
      );
    }, 1000);
    return () => clearInterval(intervalo);
  }, []);

  const cargarDatosAdmin = async () => {
    try {
      const resP = await fetch('/api/pedidos');
      if (resP.ok) {
        const dataP = await resP.json();
        setPedidos(dataP.map(p => ({ ...p, segundosTejidos: p.segundosTejidos || 0 })));
      }
      const resProd = await fetch('/api/productos');
      if (resProd.ok) setProductos(await resProd.json());
    } catch (err) {
      console.error('Error al cargar datos administrativos:', err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, clave })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('balenzaa_token', data.token);
        setToken(data.token);
        setErrorLogin('');
        mostrarToast('Sesión iniciada correctamente.', 'exito');
      } else {
        setErrorLogin(data.error || 'Credenciales incorrectas.');
      }
    } catch (err) {
      console.error(err);
      setErrorLogin('Error de conexión.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('balenzaa_token');
    setToken('');
    mostrarToast('Sesión cerrada.', 'exito');
  };

  const toggleAgenda = () => {
    const nuevoEstado = !agendaCerrada;
    setAgendaCerrada(nuevoEstado);
    localStorage.setItem('balenzaa_agenda_cerrada', nuevoEstado);
    mostrarToast(nuevoEstado ? 'Agenda cerrada para nuevos pedidos.' : 'Agenda abierta para nuevos pedidos.', 'exito');
  };

  const formatearFechaTexto = (fechaIso) => {
    if (!fechaIso) return 'Por definir';
    const partes = fechaIso.split('T')[0].split('-');
    if (partes.length === 3) return `${partes[2]}/${partes[1]}/${partes[0]}`;
    return fechaIso;
  };

  const obtenerMesDeFecha = (fechaIso) => {
    if (!fechaIso) return null;
    const partes = fechaIso.split('T')[0].split('-');
    return partes.length === 3 ? parseInt(partes[1], 10) : null;
  };

  const formatearTiempo = (totalSegundos) => {
    const seg = parseInt(totalSegundos) || 0;
    const horas = Math.floor(seg / 3600);
    const minutos = Math.floor((seg % 3600) / 60);
    const segundos = seg % 60;
    return [horas, minutos, segundos].map(v => v < 10 ? '0' + v : v).join(':');
  };

  const obtenerSuscriptoresUnicos = () => {
    const unicos = [];
    const correosVistos = new Set();
    pedidos.forEach(p => {
      if (p.suscritoClub && p.correo && p.correo.trim() !== '') {
        const correoLimpio = p.correo.trim().toLowerCase();
        if (!correosVistos.has(correoLimpio)) {
          correosVistos.add(correoLimpio);
          unicos.push(p);
        }
      }
    });
    return unicos;
  };

  const exportarPedidosCsv = () => {
    if (pedidos.length === 0) {
      mostrarToast('No hay pedidos para exportar.', 'error');
      return;
    }
    let csvContent = '\uFEFFFechaCreacion,Cliente,Correo,Celular,Pieza,FechaEntrega,PrecioTotal,Estado\n';
    pedidos.forEach(p => {
      const fechaC = `"${(p.fechaCreacion ? formatearFechaTexto(p.fechaCreacion) : '').replace(/"/g, '""')}"`;
      const nombre = `"${(p.nombre || '').replace(/"/g, '""')}"`;
      const correo = `"${(p.correo || '').replace(/"/g, '""')}"`;
      const celular = `"${(p.celular || '').replace(/"/g, '""')}"`;
      const producto = `"${(p.producto || '').replace(/"/g, '""')}"`;
      const fechaE = `"${(p.fechaEntrega ? formatearFechaTexto(p.fechaEntrega) : '').replace(/"/g, '""')}"`;
      const precio = `"${(p.precioTotal || 0)}"`;
      const estado = `"${(p.estado || 'Pendiente').replace(/"/g, '""')}"`;
      csvContent += `${fechaC},${nombre},${correo},${celular},${producto},${fechaE},${precio},${estado}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'todos_los_pedidos_balenzaa.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
    mostrarToast('Pedidos exportados con éxito.', 'exito');
  };

  const exportarClubCsv = () => {
    const suscriptores = obtenerSuscriptoresUnicos();
    if (suscriptores.length === 0) {
      mostrarToast('No hay suscriptores para exportar.', 'error');
      return;
    }
    let csvContent = '\uFEFFNombre,Correo\n';
    suscriptores.forEach(c => {
      const nombre = `"${(c.nombre || 'Cliente').replace(/"/g, '""')}"`;
      const correo = `"${c.correo.trim().replace(/"/g, '""')}"`;
      csvContent += `${nombre},${correo}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'club_balenzaa_suscriptores.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
    mostrarToast('Suscriptores exportados con éxito.', 'exito');
  };

  const pendientes = pedidos.filter(p => (p.estado || 'Pendiente') === 'Pendiente').length;
  const elaboracion = pedidos.filter(p => p.estado === 'En elaboración').length;
  const completados = pedidos.filter(p => p.estado === 'Completado').length;

  let totalIngresos = 0;
  pedidos.forEach(p => {
    const pr = parseFloat(p.precioTotal) || 0;
    if (p.estado === 'En elaboración') totalIngresos += (pr * 0.50);
    else if (p.estado === 'Completado') totalIngresos += pr;
  });

  if (!token) {
    return (
      <div className="cuerpo-admin">
        {toast && (
          <div className={`toast-notificacion ${toast.tipo} visible`} style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 10000 }}>
            {toast.mensaje}
          </div>
        )}
        <header className="barra-admin">
          <div className="contenedor-admin-header">
            <span className="nombre-marca">Balenzaa</span>
            <span className="etiqueta-panel">Panel de Control</span>
            <button onClick={onBackToStore} className="enlace-volver-tienda">Volver a la tienda</button>
          </div>
        </header>
        <main className="contenedor-principal-admin">
          <section className="tarjeta-login-admin">
            <div className="encabezado-login">
              <h2>Acceso Administrativo</h2>
              <p>Ingresa tus credenciales para gestionar pedidos y catálogo.</p>
            </div>
            <form onSubmit={handleLogin} className="formulario-login">
              <div className="grupo-campo">
                <label>Usuario</label>
                <input type="text" value={usuario} onChange={e => setUsuario(e.target.value)} required placeholder="Usuario" />
              </div>
              <div className="grupo-campo">
                <label>Contraseña</label>
                <input type="password" value={clave} onChange={e => setClave(e.target.value)} required placeholder="••••••••" />
              </div>
              <button type="submit" className="boton-ingreso-admin">Iniciar Sesión</button>
              {errorLogin && <p className="mensaje-error-login">{errorLogin}</p>}
            </form>
          </section>
        </main>
      </div>
    );
  }

  const pedidosFiltrados = pedidos.filter(p => {
    const estadoActual = p.estado || 'Pendiente';
    const cumpleEstado = (estadoFiltro === 'todos') || (estadoActual === estadoFiltro);
    const cumpleTipo = (tipoFiltro === 'todos') || (p.producto && p.producto.trim().toLowerCase() === tipoFiltro.toLowerCase());

    let cumpleMes = true;
    if (mesFiltro !== 'todos') {
      const mesC = obtenerMesDeFecha(p.fechaCreacion);
      const mesE = obtenerMesDeFecha(p.fechaEntrega);
      cumpleMes = (mesC === parseInt(mesFiltro, 10)) || (mesE === parseInt(mesFiltro, 10));
    }
    return cumpleEstado && cumpleTipo && cumpleMes;
  });

  const tiposDisponibles = Array.from(new Set(pedidos.map(p => p.producto).filter(Boolean)));

  const renderizarNombreCliente = (nombreCompleto) => {
    if (!nombreCompleto) return 'Cliente';
    const partes = nombreCompleto.trim().split(' ');
    if (partes.length === 1) return <strong>{partes[0]}</strong>;
    const primerNombre = partes[0];
    const apellido = partes.slice(1).join(' ');
    return (
      <div style={{ lineHeight: '1.2' }}>
        <strong>{primerNombre}</strong>
        <span style={{ display: 'block', fontWeight: 'bold' }}>{apellido}</span>
      </div>
    );
  };

  return (
    <div className="cuerpo-admin">
      {toast && (
        <div className={`toast-notificacion ${toast.tipo} visible`} style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 10000 }}>
          {toast.mensaje}
        </div>
      )}

      {confirmacionModal.visible && (
        <div style={{ display: 'flex', position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', zIndex: 10001, alignItems: 'center', justifyContent: 'center', padding: '1.5rem', boxSizing: 'border-box' }}>
          <div style={{ background: 'white', borderRadius: '28px', padding: '2rem', maxWidth: '420px', width: '100%', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <h3 style={{ fontFamily: 'var(--f-titulo)', color: 'var(--rosa)', margin: 0, fontSize: '1.4rem' }}>Confirmación</h3>
            <p style={{ fontFamily: 'var(--f-cuerpo)', color: 'var(--tinta)', margin: 0, fontSize: '1rem' }}>{confirmacionModal.mensaje}</p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <button
                onClick={() => setConfirmacionModal({ visible: false, mensaje: '', onAceptar: null })}
                style={{ flex: 1, background: 'var(--crema)', color: 'var(--tinta)', border: '1.5px solid var(--rosa-claro)', borderRadius: 'var(--radio-pill)', padding: '0.6rem 1rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  const accion = confirmacionModal.onAceptar;
                  setConfirmacionModal({ visible: false, mensaje: '', onAceptar: null });
                  if (accion) accion();
                }}
                style={{ flex: 1, background: 'var(--rosa)', color: 'white', border: 'none', borderRadius: 'var(--radio-pill)', padding: '0.6rem 1rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="barra-admin">
        <div className="contenedor-admin-header">
          <span className="nombre-marca">Balenzaa</span>
          <span className="etiqueta-panel">Panel de Control</span>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <button onClick={onBackToStore} className="enlace-volver-tienda" style={{ marginLeft: 0 }}>
              Volver a la tienda
            </button>
            <button onClick={handleLogout} className="boton-salir">
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main className="contenedor-principal-admin">
        <div className="panel-contenido">

          <AdminMetrics
            agendaCerrada={agendaCerrada}
            toggleAgenda={toggleAgenda}
            onOpenSubscribers={() => setModalSuscriptoresOpen(true)}
            pendientes={pendientes}
            elaboracion={elaboracion}
            completados={completados}
            totalIngresos={totalIngresos}
          />

          <AdminOrdersTable
            pedidosFiltrados={pedidosFiltrados}
            tiposDisponibles={tiposDisponibles}
            estadoFiltro={estadoFiltro}
            setEstadoFiltro={setEstadoFiltro}
            mesFiltro={mesFiltro}
            setMesFiltro={setMesFiltro}
            tipoFiltro={tipoFiltro}
            setTipoFiltro={setTipoFiltro}
            formatearFechaTexto={formatearFechaTexto}
            renderizarNombreCliente={renderizarNombreCliente}
            formatearTiempo={formatearTiempo}
            onOpenModalFoto={(p) => setModalFoto(p)}
            onUpdatePrecio={async (id, valStr) => {
              let val = parseFloat(valStr);
              if (isNaN(val) || val < 0) val = 0;
              await fetch(`/api/pedidos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ precioTotal: val })
              });
              cargarDatosAdmin();
              mostrarToast('Precio actualizado con éxito.', 'exito');
            }}
            onUpdateEstado={async (id, nuevoEstado) => {
              await fetch(`/api/pedidos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ estado: nuevoEstado })
              });
              cargarDatosAdmin();
              mostrarToast('Estado actualizado.', 'exito');
            }}
            onToggleCronometro={async (p) => {
              const nuevoActivo = !p.cronometroActivo;
              setPedidos(prev => prev.map(item => item._id === p._id ? { ...item, cronometroActivo: nuevoActivo } : item));
              await fetch(`/api/pedidos/${p._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cronometroActivo: nuevoActivo, segundosTejidos: p.segundosTejidos })
              });
            }}
            onResetCronometro={(p) => {
              solicitarConfirmacion('¿Reiniciar el cronómetro a 00:00:00?', async () => {
                setPedidos(prev => prev.map(item => item._id === p._id ? { ...item, segundosTejidos: 0, cronometroActivo: false } : item));
                await fetch(`/api/pedidos/${p._id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ segundosTejidos: 0, cronometroActivo: false })
                });
                mostrarToast('Cronómetro reiniciado.', 'exito');
              });
            }}
            onDeletePedido={(id) => {
              solicitarConfirmacion('¿Estás segura de eliminar este encargo?', async () => {
                await fetch(`/api/pedidos/${id}`, { method: 'DELETE' });
                cargarDatosAdmin();
                mostrarToast('Encargo eliminado.', 'exito');
              });
            }}
            exportarPedidosCsv={exportarPedidosCsv}
            onOpenModalManual={() => setModalPedidoManualOpen(true)}
          />

          <AdminCatalog
            productos={productos}
            onDeleteProducto={(id) => {
              solicitarConfirmacion('¿Estás segura de eliminar esta pieza?', async () => {
                await fetch(`/api/productos/${id}`, { method: 'DELETE' });
                cargarDatosAdmin();
                mostrarToast('Pieza eliminada del catálogo.', 'exito');
              });
            }}
            onUpdateProductoField={async (id, campo, valor) => {
              const body = {};
              if (campo === 'precio') {
                let val = parseFloat(valor);
                if (isNaN(val) || val < 0) val = 0;
                body.precio = val;
              } else {
                body[campo] = valor;
              }
              await fetch(`/api/productos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
              });
              cargarDatosAdmin();
              mostrarToast(`${campo === 'precio' ? 'Precio' : campo === 'nombre' ? 'Nombre' : 'Descripción'} actualizado.`, 'exito');
            }}
            onOpenModalNuevoProd={() => setModalNuevoProdOpen(true)}
          />

        </div>
      </main>

      <OrderDetailsModal
        modalFoto={modalFoto}
        onClose={() => setModalFoto(null)}
        formatearFechaTexto={formatearFechaTexto}
      />

      <SubscribersModal
        isOpen={modalSuscriptoresOpen}
        onClose={() => setModalSuscriptoresOpen(false)}
        suscriptores={obtenerSuscriptoresUnicos()}
        exportarClubCsv={exportarClubCsv}
        mostrarToast={mostrarToast}
      />

      <ManualOrderModal
        isOpen={modalPedidoManualOpen}
        onClose={() => setModalPedidoManualOpen(false)}
        manual={manual}
        setManual={setManual}
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            const res = await fetch('/api/pedidos', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(manual)
            });
            if (res.ok) {
              setModalPedidoManualOpen(false);
              setManual({ nombre: '', correo: '', celular: '', producto: 'Amigurumis', detalles: '', fechaEntrega: '', precioTotal: '', horas: 0, minutos: 0, estado: 'Pendiente' });
              cargarDatosAdmin();
              mostrarToast('Encargo registrado con éxito.', 'exito');
            }
          } catch (err) { console.error(err); }
        }}
      />

      <NewProductModal
        isOpen={modalNuevoProdOpen}
        onClose={() => {
          setModalNuevoProdOpen(false);
          setNuevoProd({ nombre: '', categoria: 'Amigurumis', precio: '', descripcion: '', imagen: '' });
          setNombreFotoAdmin('Ningún archivo seleccionado');
        }}
        nuevoProd={nuevoProd}
        setNuevoProd={setNuevoProd}
        nombreFotoAdmin={nombreFotoAdmin}
        setNombreFotoAdmin={setNombreFotoAdmin}
        productos={productos}
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            const res = await fetch('/api/productos', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(nuevoProd)
            });
            if (res.ok) {
              setModalNuevoProdOpen(false);
              setNuevoProd({ nombre: '', categoria: 'Amigurumis', precio: '', descripcion: '', imagen: '' });
              setNombreFotoAdmin('Ningún archivo seleccionado');
              cargarDatosAdmin();
              mostrarToast('Nueva pieza agregada al catálogo.', 'exito');
            }
          } catch (err) { console.error(err); }
        }}
      />
    </div>
  );
}

export default AdminPanel;