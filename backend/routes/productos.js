const express = require('express');
const Producto = require('../models/Producto');

const router = express.Router();

// RUTAS API PRODUCTOS
router.get('/', async (req, res) => {
    try {
        const productos = await Producto.find().sort({ _id: -1 }).lean();
        res.json(productos);
    } catch (err) {
        console.error('Error al obtener productos del catálogo:', err);
        res.status(500).json({ error: 'Error al obtener productos del catálogo' });
    }
});

router.post('/', async (req, res) => {
    try {
        const nuevoProducto = new Producto(req.body);
        await nuevoProducto.save();
        res.status(201).json(nuevoProducto);
    } catch (err) {
        console.error('Error al agregar producto al catálogo:', err);
        res.status(400).json({ error: 'Error al agregar producto al catálogo' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const productoActualizado = await Producto.findByIdAndUpdate(
            req.params.id,
            req.body,
            { returnDocument: 'after' }
        );
        res.json(productoActualizado);
    } catch (err) {
        console.error('Error al actualizar producto:', err);
        res.status(400).json({ error: 'Error al actualizar producto' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Producto.findByIdAndDelete(req.params.id);
        res.json({ mensaje: 'Producto eliminado con éxito' });
    } catch (err) {
        console.error('Error al eliminar producto:', err);
        res.status(400).json({ error: 'Error al eliminar producto' });
    }
});

module.exports = router;