const { response } = require('express');
const Comentario = require('../models/comentario.model');
const Usuario = require('../models/usuario.model');
const { getRedisClient } = require('../database/config');
const redisClient = getRedisClient();

const crearComentario = async(req, res = response) => {
    const { emailUsuario, texto } = req.body;

    try {
        const existeEmail = await Usuario.findOne({ email: emailUsuario });

        if (!existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe.',
            });
        }

        const comentario = new Comentario(req.body);

        await comentario.save();

        console.log('comentario: ', comentario);
        res.json({
            ok: true,
            comentario,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs',
        });
    }
};

const listarComentariosByUsuario = async(req, res = response) => {
    // const email  = req.params.email;
    const { email } = req.params;
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
        return res.status(400).json({
            ok: false,
            msg: 'El usuario no existe.',
        });
    }

    const comentarios = await Comentario.find({ emailUsuario: email });
    console.log('comentario: ', comentarios);

    redisClient.setex(email, 3600, JSON.stringify(comentarios));

    res.json({
        ok: true,
        comentarios,
    });
};

const calificarComentario = async(req, res = response) => {
    const { idComentario, emailUsuario, calificacion } = req.body;

    try {
        const existeEmail = await Usuario.findOne({ email: emailUsuario });
        const comentario = await Comentario.findById(idComentario);
        const calificacionValida = calificacion == 'ME GUSTA' || calificacion == 'NO ME GUSTA';

        if (!existeEmail || !comentario || !calificacionValida) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario/comentario no existe o la calificacion es invalida',
            });
        }

        comentario.calificacion.push(calificacion);

        await comentario.save();

        console.log('comentario: ', comentario);
        res.json({
            ok: true,
            comentario,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs',
        });
    }
};

const leerComentario = async(req, res = response) => {
    const { idComentario } = req.params;
    console.log('idComentario: ', idComentario);    
    const comentario = await Comentario.findById(idComentario);
    console.log('comentario: ', comentario);

    if (!comentario) {
        return res.status(400).json({
            ok: false,
            msg: 'El comentraio no existe.',
        });
    }

    console.log('calificacion:: ' , comentario.get('calificacion'));

    const megustas = comentario.get('calificacion').filter( calificiacion => calificiacion === 'ME GUSTA');
    const nomegustas = comentario.get('calificacion').filter( calificiacion => calificiacion === 'NO ME GUSTA');

    const comentarioResult = {
        ...comentario._doc,        
        cantidadMeGustas: megustas.length,
        cantidadNoMeGustas: nomegustas.length
    }

    redisClient.setex(idComentario, 3600, JSON.stringify(comentarioResult));

    res.json({
        ok: true,
        comentario: comentarioResult,
    });
};

module.exports = {
    crearComentario,
    listarComentariosByUsuario,
    calificarComentario,
    leerComentario
};