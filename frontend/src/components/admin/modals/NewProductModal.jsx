import React, { useState, useEffect } from 'react';

const CATEGORIAS_BASE = ['Amigurumis', 'Llaveros', 'Ramos de Flores'];

function NewProductModal({
  isOpen,
  onClose,
  nuevoProd,
  setNuevoProd,
  nombreFotoAdmin,
  setNombreFotoAdmin,
  onSubmit,
  productos = []
}) {
  const [modoNuevaCategoria, setModoNuevaCategoria] = useState(false);
  const [categoriaPersonalizada, setCategoriaPersonalizada] = useState('');

  const categoriasExistentes = Array.from(
    new Set([
      ...CATEGORIAS_BASE,
      ...productos
        .map(p => (p.categoria || '').trim())
        .filter(Boolean)
    ])
  );

  useEffect(() => {
    if (!isOpen) {
      setModoNuevaCategoria(false);
      setCategoriaPersonalizada('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const normalizarCategoria = (texto) => {
    const limpio = texto.trim().replace(/\s+/g, ' ');
    if (!limpio) return '';
    return limpio.charAt(0).toUpperCase() + limpio.slice(1);
  };

  const handleSelectCategoria = (e) => {
    const valor = e.target.value;
    if (valor === '__nueva__') {
      setModoNuevaCategoria(true);
      setNuevoProd({ ...nuevoProd, categoria: '' });
    } else {
      setModoNuevaCategoria(false);
      setCategoriaPersonalizada('');
      setNuevoProd({ ...nuevoProd, categoria: valor });
    }
  };

  const handleCambioNuevaCategoria = (e) => {
    const texto = e.target.value;
    setCategoriaPersonalizada(texto);
    setNuevoProd({ ...nuevoProd, categoria: normalizarCategoria(texto) });
  };

  const handleFormSubmit = (e) => {
    if (modoNuevaCategoria) {
      const categoriaLimpia = normalizarCategoria(categoriaPersonalizada);
      if (!categoriaLimpia) {
        e.preventDefault();
        return;
      }
      nuevoProd.categoria = categoriaLimpia;
    }
    onSubmit(e);
  };

  return (
    <div style={{ display: 'flex', position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', zIndex: 9999, alignItems: 'center', justifyContent: 'center', padding: '1.5rem', boxSizing: 'border-box' }}>
      <div style={{ background: 'white', borderRadius: '28px', padding: '2rem', maxWidth: '500px', width: '100%', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', boxSizing: 'border-box' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '1.2rem', fontWeight: 'bold', color: '#C93A5B', cursor: 'pointer', padding: '4px 8px', lineHeight: 1 }}>✕</button>
        <h3 style={{ fontFamily: 'var(--f-titulo)', color: '#F2678A', margin: '0 0 1.2rem 0', fontSize: '1.5rem' }}>Agregar Nueva Pieza al Catálogo</h3>
        <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
          <div className="grupo-campo" style={{ margin: 0 }}>
            <label>Nombre de la pieza *</label>
            <input type="text" required value={nuevoProd.nombre} onChange={e => setNuevoProd({ ...nuevoProd, nombre: e.target.value })} placeholder="Nombre" />
          </div>
          <div className="grupo-campo" style={{ margin: 0 }}>
            <label>Categoría *</label>
            <select
              value={modoNuevaCategoria ? '__nueva__' : nuevoProd.categoria}
              onChange={handleSelectCategoria}
              style={{ width: '100%', padding: '0.7rem', borderRadius: '18px', border: '1.5px solid #FBC5D6' }}
            >
              {categoriasExistentes.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
              <option value="__nueva__">+ Nueva categoría...</option>
            </select>
            {modoNuevaCategoria && (
              <input
                type="text"
                required
                value={categoriaPersonalizada}
                onChange={handleCambioNuevaCategoria}
                placeholder="Ej: Bolsos, Accesorios, Llaveros tejido"
                style={{ marginTop: '0.6rem', width: '100%', padding: '0.7rem', borderRadius: '18px', border: '1.5px solid #FBC5D6', boxSizing: 'border-box' }}
              />
            )}
          </div>
          <div className="grupo-campo" style={{ margin: 0 }}>
            <label>Precio referencial (USD) *</label>
            <input type="number" step="0.50" min="0" required value={nuevoProd.precio} onChange={e => setNuevoProd({ ...nuevoProd, precio: Math.max(0, parseFloat(e.target.value) || 0) })} placeholder="Ej: 15.00" />
          </div>
          <div className="grupo-campo" style={{ margin: 0 }}>
            <label>Descripción de la pieza *</label>
            <textarea rows="3" required value={nuevoProd.descripcion} onChange={e => setNuevoProd({ ...nuevoProd, descripcion: e.target.value })} placeholder="Materiales y medidas"></textarea>
          </div>
          <div className="grupo-campo" style={{ margin: 0 }}>
            <label>Foto de la pieza *</label>
            <div className="contenedor-input-archivo">
              <input type="file" id="subir-foto-prod" accept="image/*" className="input-archivo-oculto" onChange={(ev) => {
                const file = ev.target.files[0];
                if (file) {
                  setNombreFotoAdmin(file.name);
                  const reader = new FileReader();
                  reader.onload = (event) => setNuevoProd({ ...nuevoProd, imagen: event.target.result });
                  reader.readAsDataURL(file);
                }
              }} />
              <label htmlFor="subir-foto-prod" className="boton-subir-archivo">Subir foto</label>
              <span className="texto-nombre-archivo">{nombreFotoAdmin}</span>
            </div>
          </div>
          <button type="submit" style={{ width: '100%', backgroundColor: '#F2678A', color: '#fff', borderRadius: '999px', border: 'none', padding: '0.7rem', fontWeight: 700, cursor: 'pointer' }}>Guardar pieza en catálogo</button>
        </form>
      </div>
    </div>
  );
}

export default NewProductModal;