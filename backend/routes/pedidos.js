const express = require('express');
const Pedido = require('../models/Pedido');

const router = express.Router();

// RUTAS API PEDIDOS
router.post('/', async (req, res) => {
    try {
        const nuevoPedido = new Pedido(req.body);
        await nuevoPedido.save();
        res.status(201).json({ mensaje: 'Pedido guardado con éxito', pedido: nuevoPedido });
    } catch (err) {
        console.error('Error al guardar pedido:', err);
        res.status(400).json({ error: err.message || 'Error al registrar el pedido' });
    }
});

router.get('/', async (req, res) => {
    try {
        const pedidos = await Pedido.find().sort({ fechaCreacion: -1 });
        res.json(pedidos);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener pedidos' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const pedidoActualizado = await Pedido.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(pedidoActualizado);
    } catch (err) {
        res.status(400).json({ error: 'Error al actualizar el pedido' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Pedido.findByIdAndDelete(req.params.id);
        res.json({ mensaje: 'Pedido eliminado con éxito' });
    } catch (err) {
        res.status(400).json({ error: 'Error al eliminar el pedido' });
    }
});

module.exports = router;