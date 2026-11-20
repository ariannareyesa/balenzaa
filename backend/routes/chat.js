const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { mensaje } = req.body;

    if (!mensaje || typeof mensaje !== 'string' || !mensaje.trim()) {
      return res.status(400).json({ error: 'El mensaje es requerido.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Falta configurar la GEMINI_API_KEY en el servidor.' });
    }

    const systemPrompt = `Eres balenzIA, asistente virtual de Balenzaa (crochet artesanal en Guayaquil, Ecuador, dirigido por Romina Reyes). 
Responde con calidez, emojis tiernos (🌸, 🧶) y en máximo 2 o 3 frases. 
- Dudas de precios o disponibilidad: sugiéreles amablemente hacer un "Encargo personalizado".
- Dudas de cuidados: indica que los amigurumis se lavan a mano con agua fría y jabón suave, sin escurrir.
- Dudas fuera de contexto: guíalos a contactar directamente con Romina por WhatsApp.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${encodeURIComponent(apiKey)}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    let response;
    let data;

    try {
      response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                { text: `${systemPrompt}\n\nCliente: ${mensaje.trim()}` }
              ]
            }
          ]
        })
      });
      data = await response.json();
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      console.warn('Aviso de la API de Google:', JSON.stringify(data));
      return res.json({
        respuesta: 'El chatbot no funciona actualmente 🌸 Cuéntale a Romina lo que buscas en el botón de WhatsApp para hacer tu pedido. ✨'
      });
    }

    const textoRespuesta = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '¡Te responderemos pronto por WhatsApp! 🧶';
    res.json({ respuesta: textoRespuesta });
  } catch (error) {
    if (error.name === 'AbortError') {
      console.warn('Timeout al consultar Gemini en /api/chat');
    } else {
      console.error('Error interno en la ruta del chat:', error);
    }
    res.json({
      respuesta: 'El chatbot no funciona actualmente 🌸 Cuéntale a Romina lo que buscas en el botón de WhatsApp para hacer tu pedido. ✨'
    });
  }
});

module.exports = router;