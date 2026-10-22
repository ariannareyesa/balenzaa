const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// 1. IMPORTAR EL MODELO DE PEDIDOS
const Pedido = require('./models/Pedido');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares (límite aumentado para aceptar imágenes de referencia)
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Servir frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado exitosamente a MongoDB Atlas'))
  .catch((err) => console.error('Error al conectar a MongoDB:', err));

// 2. RUTA PARA RECIBIR PEDIDOS DESDE LA TIENDA
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

// 3. RUTA PARA CONSULTAR PEDIDOS (PARA EL PANEL ADMIN)
app.get('/api/pedidos', async (req, res) => {
    try {
        const pedidos = await Pedido.find().sort({ fechaCreacion: -1 });
        res.json(pedidos);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener pedidos' });
    }
});

// Servir página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});