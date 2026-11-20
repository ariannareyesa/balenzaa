const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');

const router = express.Router();

// RUTA AUTENTICACIÓN ADMIN
router.post('/login', async (req, res) => {
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

module.exports = router;