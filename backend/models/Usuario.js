const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    usuario: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    clave: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Usuario', usuarioSchema);