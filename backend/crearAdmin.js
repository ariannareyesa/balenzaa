const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Usuario = require('./models/Usuario');

async function crearAdminInicial() {
    try {
        const usuarioAdmin = process.env.ADMIN_USER;
        const claveAdmin = process.env.ADMIN_PASS;

        if (!usuarioAdmin || !claveAdmin) {
            console.error('Error: Debes definir ADMIN_USER y ADMIN_PASS en tu archivo .env');
            process.exit(1);
        }

        await mongoose.connect(process.env.MONGODB_URI);

        const existe = await Usuario.findOne({ usuario: usuarioAdmin });
        if (existe) {
            console.log(`El usuario '${usuarioAdmin}' ya existe en la base de datos.`);
            process.exit();
        }

        const claveHash = await bcrypt.hash(claveAdmin, 10);
        const nuevoAdmin = new Usuario({
            usuario: usuarioAdmin,
            clave: claveHash
        });

        await nuevoAdmin.save();
        console.log(`¡Usuario '${usuarioAdmin}' creado con éxito en MongoDB Atlas!`);
        process.exit();
    } catch (error) {
        console.error('Error al crear administrador:', error);
        process.exit(1);
    }
}

crearAdminInicial();