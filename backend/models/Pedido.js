const mongoose = require('mongoose');

const PedidoSchema = new mongoose.Schema({
    nombre: { 
        type: String, 
        required: [true, 'El nombre es obligatorio'],
        trim: true 
    },
    correo: { 
        type: String, 
        required: [true, 'El correo es obligatorio'],
        trim: true,
        lowercase: true,
        // Validación con Expresión Regular para asegurar que tenga '@' y un dominio válido
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingresa un correo electrónico válido']
    },
    celular: { 
        type: String, 
        required: [true, 'El número celular es obligatorio'],
        trim: true 
    },
    producto: { 
        type: String, 
        required: [true, 'El tipo de producto es obligatorio'],
        trim: true 
    },
    detalles: { 
        type: String, 
        required: [true, 'Los detalles son obligatorios'],
        trim: true 
    },
    imagenReferencia: { 
        type: String, 
        default: null 
    },
    fechaEntrega: { 
        type: Date, 
        required: [true, 'La fecha de entrega es obligatoria'] 
    },
    suscritoClub: { 
        type: Boolean, 
        default: false 
    },
    estado: { 
        type: String, 
        enum: ['Pendiente', 'En elaboración', 'Completado'], // Restringe solo a estos 3 estados válidos
        default: 'Pendiente' 
    },
    precioTotal: { 
        type: Number, 
        default: 0,
        min: [0, 'El precio no puede ser negativo'] 
    },
    segundosTejidos: { 
        type: Number, 
        default: 0,
        min: 0 
    },
    cronometroActivo: { 
        type: Boolean, 
        default: false 
    },
    fechaCreacion: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Pedido', PedidoSchema);