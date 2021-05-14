const { response } = require('express');

const Usuario = require('../models/usuario.model');

const crearUsuarios = async(req, res = response) => {
    const { email } = req.body;

    try {
        const existeEmail = await Usuario.findOne({ email });

        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado',
            });
        }

        const usuario = new Usuario(req.body);

        await usuario.save();

        console.log('usuario: ', usuario);
        res.json({
            ok: true,
            usuario,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs',
        });
    }
};

module.exports = {
    crearUsuarios,
};