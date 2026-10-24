const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// IMPORTAR MODELOS
const Pedido = require('./models/Pedido');
const Producto = require('./models/Producto');
const Usuario = require('./models/Usuario');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Definir la ruta absoluta hacia el frontend
const frontendPath = path.resolve(__dirname, '..', 'frontend');
console.log('Carpeta frontend configurada en:', frontendPath);

// Servir estáticos
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

// RUTA AUTENTICACIÓN ADMIN
app.post('/api/auth/login', async (req, res) => {
    try {
        const { usuario, clave } = req.body;
        const adminEncontrado = await Usuario.findOne({ usuario });

        if (!adminEncontrado) {
            return res.status(400).json({ error: 'Usuario o contraseña incorrectos.' });
        }

        const claveValida = await bcrypt.compare(clave, adminEncontrado.clave);
        if (!claveValida) {
            return res.status(400).json({ error: 'Usuario o contraseña incorrectos.' });
        }

        if (!process.env.JWT_SECRET) {
            console.error('Error: JWT_SECRET no está definido en el .env');
            return res.status(500).json({ error: 'Error de configuración del servidor.' });
        }

        const token = jwt.sign(
            { id: adminEncontrado._id, usuario: adminEncontrado.usuario },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({ token, mensaje: 'Autenticación exitosa.' });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// RUTAS API PEDIDOS
app.post('/api/pedidos', async (req, res) => {
    try {
        const nuevoPedido = new Pedido(req.body);
        await nuevoPedido.save();
        res.status(201).json({ mensaje: 'Pedido guardado con éxito', pedido: nuevoPedido });
    } catch (err) {
        console.error('Error al guardar pedido:', err);
        res.status(400).json({ error: err.message || 'Error al registrar el pedido' });
    }
});

app.get('/api/pedidos', async (req, res) => {
    try {
        const pedidos = await Pedido.find().sort({ fechaCreacion: -1 });
        res.json(pedidos);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener pedidos' });
    }
});

app.put('/api/pedidos/:id', async (req, res) => {
    try {
        const pedidoActualizado = await Pedido.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(pedidoActualizado);
    } catch (err) {
        res.status(400).json({ error: 'Error al actualizar el pedido' });
    }
});

app.delete('/api/pedidos/:id', async (req, res) => {
    try {
        await Pedido.findByIdAndDelete(req.params.id);
        res.json({ mensaje: 'Pedido eliminado con éxito' });
    } catch (err) {
        res.status(400).json({ error: 'Error al eliminar el pedido' });
    }
});

// RUTAS API PRODUCTOS
app.get('/api/productos', async (req, res) => {
    try {
        const productos = await Producto.find().sort({ createdAt: -1 });
        res.json(productos);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener productos del catálogo' });
    }
});

app.post('/api/productos', async (req, res) => {
    try {
        const nuevoProducto = new Producto(req.body);
        await nuevoProducto.save();
        res.status(201).json(nuevoProducto);
    } catch (err) {
        res.status(400).json({ error: 'Error al agregar producto al catálogo' });
    }
});

app.put('/api/productos/:id', async (req, res) => {
    try {
        const productoActualizado = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(productoActualizado);
    } catch (err) {
        res.status(400).json({ error: 'Error al actualizar producto' });
    }
});

app.delete('/api/productos/:id', async (req, res) => {
    try {
        await Producto.findByIdAndDelete(req.params.id);
        res.json({ mensaje: 'Producto eliminado con éxito' });
    } catch (err) {
        res.status(400).json({ error: 'Error al eliminar producto' });
    }
});

// Rutas explícitas para servir el frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(frontendPath, 'admin.html'));
});

// Fallback universal
app.use((req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Iniciar servidor local
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});