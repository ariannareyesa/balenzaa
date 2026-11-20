const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const pedidosRoutes = require('./routes/pedidos');
const productosRoutes = require('./routes/productos');
const chatRoutes = require('./routes/chat');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares (Límites ampliados a 25mb para las imágenes en base64)
app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb', extended: true }));

// Definir la ruta absoluta hacia el build de React
const frontendPath = path.resolve(__dirname, '..', 'frontend', 'dist');
console.log('Carpeta frontend configurada en:', frontendPath);

// Servir archivos estáticos compilados
app.use(express.static(frontendPath));

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado exitosamente a MongoDB Atlas'))
  .catch((err) => console.error('Error al conectar a MongoDB:', err));

// Middleware de seguridad JWT para proteger rutas privadas
function verificarToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
    }

    try {
        const verificado = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = verificado;
        next();
    } catch (error) {
        res.status(403).json({ error: 'Token inválido o expirado.' });
    }
}

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/chat', chatRoutes);

// Rutas para servir la SPA compilada de React
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Fallback universal para rutas de la aplicación
app.use((req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Iniciar servidor local en el puerto 3000
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});