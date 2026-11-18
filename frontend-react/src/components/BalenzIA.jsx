import React, { useState } from 'react';

function BalenzIA() {
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState([
    { remitente: 'bot', texto: '¡Hola! 🌸 Soy balenzIA, tu asistente virtual de crochet. ¿En qué te puedo ayudar hoy?' }
  ]);
  const [inputTexto, setInputTexto] = useState('');
  const [cargando, setCargando] = useState(false);

  const enviarMensaje = async (e) => {
    e.preventDefault();
    if (!inputTexto.trim()) return;

    const mensajeUsuario = inputTexto;
    setMensajes(prev => [...prev, { remitente: 'usuario', texto: mensajeUsuario }]);
    setInputTexto('');
    setCargando(true);

    try {
      const res = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensaje: mensajeUsuario })
      });
      const data = await res.json();
      
      setMensajes(prev => [...prev, { remitente: 'bot', texto: data.respuesta || '¡Te responderemos pronto por WhatsApp! 🧶' }]);
    } catch (err) {
      console.error(err);
      setMensajes(prev => [...prev, { remitente: 'bot', texto: '¡Ups! Ocurrió un pequeño error de conexión, pero Romina te atiende con gusto en el botón de WhatsApp. ✨' }]);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', left: '20px', zIndex: 9998, fontFamily: 'var(--f-cuerpo)' }}>
      {/* Botón flotante izquierdo */}
      {!abierto && (
        <button 
          onClick={() => setAbierto(true)}
          aria-label="Abrir asistente balenzIA"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            filter: 'drop-shadow(0 4px 12px rgba(116,64,79,0.2))',
            transition: 'transform 0.2s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.06)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <img 
            src="/images/BalenzIA.png" 
            alt="BalenzIA" 
            style={{ width: '90px', height: 'auto', objectFit: 'contain', display: 'block' }} 
          />
        </button>
      )}

      {/* Ventana del Chat */}
      {abierto && (
        <div style={{
          width: '330px',
          height: '440px',
          background: 'white',
          borderRadius: '24px',
          boxShadow: '0 12px 35px rgba(116,64,79,0.22)',
          border: '2px solid var(--rosa-claro)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Cabecera del Chat */}
          <div style={{
            background: 'var(--rosa)',
            color: 'white',
            padding: '0.7rem 1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontWeight: 'bold'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img 
                src="/images/BalenzIA.png" 
                alt="BalenzIA" 
                style={{ width: '35px', height: 'auto', objectFit: 'contain' }} 
              />
              <span style={{ fontFamily: 'var(--f-titulo)', fontSize: '1.1rem' }}>balenzIA</span>
            </div>
            <button 
              onClick={() => setAbierto(false)}
              style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.2rem', cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>

          {/* Cuerpo de mensajes */}
          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.6rem', background: '#FFFDF9' }}>
            {mensajes.map((m, index) => (
              <div key={index} style={{
                alignSelf: m.remitente === 'usuario' ? 'flex-end' : 'flex-start',
                background: m.remitente === 'usuario' ? 'var(--rosa-pastel)' : 'white',
                color: 'var(--tinta)',
                padding: '0.6rem 0.9rem',
                borderRadius: '16px',
                fontSize: '0.88rem',
                maxWidth: '80%',
                border: m.remitente === 'bot' ? '1px solid var(--rosa-claro)' : 'none'
              }}>
                {m.texto}
              </div>
            ))}
            {cargando && <div style={{ fontSize: '0.8rem', color: '#888', fontStyle: 'italic' }}>balenzIA está escribiendo...</div>}
          </div>

          {/* Input para escribir */}
          <form onSubmit={enviarMensaje} style={{ display: 'flex', borderTop: '1px solid var(--rosa-claro)', padding: '0.5rem', background: 'white' }}>
            <input 
              type="text" 
              value={inputTexto} 
              onChange={e => setInputTexto(e.target.value)}
              placeholder="Escribe tu duda..."
              style={{ flex: 1, border: 'none', padding: '0.5rem', fontSize: '0.9rem', outline: 'none' }}
            />
            <button type="submit" style={{ background: 'var(--rosa)', color: 'white', border: 'none', borderRadius: '12px', padding: '0 0.9rem', cursor: 'pointer', fontWeight: 'bold' }}>
              ➤
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default BalenzIA;