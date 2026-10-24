const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    categoria: { type: String, required: true },
    precio: { type: Number, required: true },
    descripcion: { type: String, default: '' },
    imagen: { type: String, default: 'images/amigurumi.jpg' }
}, { timestamps: true });

module.exports = mongoose.model('Producto', productoSchema);