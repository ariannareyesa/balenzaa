import React, { useState } from 'react';

function OrderModal({ isOpen, onClose, initialDetails = '' }) {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [celular, setCelular] = useState('');
  const [tipoProducto, setTipoProducto] = useState('Diseño personalizado / Varios / Otro');
  const [detalles, setDetalles] = useState(initialDetails);
  const [fechaEntrega, setFechaEntrega] = useState('');
  const [suscritoClub, setSuscritoClub] = useState(false);
  const [archivoNombre, setArchivoNombre] = useState('Ningún archivo seleccionado');

  // Actualizar detalles si cambian desde el carrito
  React.useEffect(() => {
    if (initialDetails) setDetalles(initialDetails);
  }, [initialDetails]);

  if (!isOpen) return null;

  const hoyStr = new Date().toISOString().split('T')[0];
  const celularRegex = /^09\d{8}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre.trim()) {
      alert('Por favor, ingresa tu nombre completo.');
      return;
    }
    if (!correo.includes('@') || !correo.includes('.')) {
      alert('Por favor, ingresa un correo válido.');
      return;
    }
    if (!celularRegex.test(celular)) {
      alert('Ingresa un celular válido (10 dígitos empezando con 09).');
      return;
    }
    if (!detalles.trim()) {
      alert('Por favor, ingresa los detalles del pedido.');
      return;
    }
    if (!fechaEntrega || fechaEntrega < hoyStr) {
      alert('Selecciona una fecha válida a partir de hoy.');
      return;
    }

    const nuevoPedido = {
      nombre,
      correo,
      celular,
      producto: tipoProducto,
      detalles,
      fechaEntrega,
      suscritoClub
    };

    try {
      const respuesta = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoPedido)
      });

      if (respuesta.ok) {
        alert(`¡Gracias ${nombre}, tu encargo ha sido registrado con éxito!`);
        localStorage.removeItem('balenzaa_carrito');
        onClose();
      } else {
        alert('Error al registrar el pedido en el servidor.');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión al enviar el pedido.');
    }
  };

  return (
    <div style={{ display: 'flex', position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', zIndex: 9999, alignItems: 'center', justifyContent: 'center', padding: '1rem', boxSizing: 'border-box' }}>
      <div style={{ background: 'white', borderRadius: '24px', padding: '1.5rem', maxWidth: '480px', width: '100%', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', boxSizing: 'border-box' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '14px', right: '14px', background: 'none', border: 'none', fontSize: '1.1rem', fontWeight: 'bold', color: '#C93A5B', cursor: 'pointer', padding: '4px 8px' }}>✕</button>
        
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontFamily: 'var(--f-titulo)', color: 'var(--rosa)', fontSize: '1.6rem', margin: 0 }}>Encargo Personalizado</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--tinta)', marginTop: '0.3rem' }}>Cuéntanos tu idea y Romina se contactará contigo.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', textAlign: 'left' }}>
          <div className="grupo-campo" style={{ marginBottom: 0 }}>
            <label>Tu nombre completo *</label>
            <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} required placeholder="Ej: Romina Reyes" />
          </div>

          <div className="grupo-campo" style={{ marginBottom: 0 }}>
            <label>Correo electrónico *</label>
            <input type="email" value={correo} onChange={e => setCorreo(e.target.value)} required placeholder="tu-correo@email.com" />
          </div>

          <div className="grupo-campo" style={{ marginBottom: 0 }}>
            <label>Número de WhatsApp / Celular *</label>
            <input type="tel" value={celular} onChange={e => setCelular(e.target.value)} required placeholder="Ej: 0912345678" />
          </div>

          <div className="grupo-campo" style={{ marginBottom: 0 }}>
            <label>¿Qué te gustaría encargar? *</label>
            <select value={tipoProducto} onChange={e => setTipoProducto(e.target.value)} required>
              <option value="Amigurumis">Amigurumis</option>
              <option value="Llaveros">Llaveros</option>
              <option value="Ramos de Flores">Ramos de Flores</option>
              <option value="Diseño personalizado / Varios / Otro">Diseño personalizado / Varios / Otro</option>
            </select>
          </div>

          <div className="grupo-campo" style={{ marginBottom: 0 }}>
            <label>Detalles, observaciones o colores *</label>
            <textarea rows="2" value={detalles} onChange={e => setDetalles(e.target.value)} placeholder="Cuéntame colores de preferencia o referencias..." required />
          </div>

          <div className="grupo-campo" style={{ marginBottom: 0 }}>
            <label>¿Para qué fecha lo necesitas? *</label>
            <input type="date" min={hoyStr} value={fechaEntrega} onChange={e => setFechaEntrega(e.target.value)} required />
          </div>

          <div className="grupo-checkbox" style={{ marginBottom: 0 }}>
            <input type="checkbox" id="club" checked={suscritoClub} onChange={e => setSuscritoClub(e.target.checked)} />
            <label htmlFor="club">Unirme al Club Balenzaa para recibir sorpresas ✿</label>
          </div>

          <button type="submit" className="boton-confirmar-pedido" style={{ width: '100%', marginTop: '0.3rem', textAlign: 'center' }}>Confirmar encargo</button>
        </form>
      </div>
    </div>
  );
}

export default OrderModal;