const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 120000);

  try {
    const { mensaje } = req.body;

    if (!mensaje || typeof mensaje !== 'string' || !mensaje.trim()) {
      clearTimeout(timeoutId);
      return res.status(400).json({ error: 'El mensaje es requerido.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      clearTimeout(timeoutId);
      return res.status(500).json({ error: 'Falta configurar la GEMINI_API_KEY en el servidor.' });
    }

    const systemPrompt = `Eres balenzIA, asistente virtual de Balenzaa (crochet artesanal en Guayaquil, Ecuador, dirigido por Romina Reyes). 
Responde con calidez, emojis tiernos (🌸, 🧶) y en máximo 2 o 3 frases. 
- Dudas de precios o disponibilidad: sugiéreles amablemente hacer un "Encargo personalizado".
- Dudas de cuidados: indica que los amigurumis se lavan a mano con agua fría y jabón suave, sin escurrir.
- Dudas fuera de contexto: guíalos a contactar directamente con Romina por WhatsApp.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:streamGenerateContent?alt=sse&key=${encodeURIComponent(apiKey)}`;

    const response = await fetch(url, {
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
        ],
        generationConfig: {
          thinkingConfig: {
            thinkingLevel: 'MINIMAL'
          }
        }
      })
    });

    if (!response.ok || !response.body) {
      let errorData = null;
      try {
        errorData = await response.json();
      } catch (_) {}
      console.warn('Aviso de la API de Google:', JSON.stringify(errorData));
      clearTimeout(timeoutId);
      return res.json({
        respuesta: 'El chatbot no funciona actualmente 🌸 Cuéntale a Romina lo que buscas en el botón de WhatsApp para hacer tu pedido. ✨'
      });
    }

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let enviòAlgo = false;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lineas = buffer.split('\n');
      buffer = lineas.pop() || '';

      for (const linea of lineas) {
        const trimmed = linea.trim();
        if (!trimmed.startsWith('data:')) continue;

        const jsonStr = trimmed.slice(5).trim();
        if (!jsonStr || jsonStr === '[DONE]') continue;

        try {
          const parsed = JSON.parse(jsonStr);
          const parts = parsed?.candidates?.[0]?.content?.parts || [];
          for (const part of parts) {
            if (part?.text && !part?.thought) {
              res.write(part.text);
              enviòAlgo = true;
            }
          }
        } catch (_) {}
      }
    }

    if (!enviòAlgo) {
      res.write('¡Te responderemos pronto por WhatsApp! 🧶');
    }

    clearTimeout(timeoutId);
    res.end();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      console.warn('Timeout al consultar Gemini en /api/chat');
    } else {
      console.error('Error interno en la ruta del chat:', error);
    }

    if (!res.headersSent) {
      return res.json({
        respuesta: 'El chatbot no funciona actualmente 🌸 Cuéntale a Romina lo que buscas en el botón de WhatsApp para hacer tu pedido. ✨'
      });
    }

    if (!res.writableEnded) {
      res.write('\n\nEl chatbot no funciona actualmente 🌸 Cuéntale a Romina lo que buscas en el botón de WhatsApp para hacer tu pedido. ✨');
      res.end();
    }
  }
});

module.exports = router;