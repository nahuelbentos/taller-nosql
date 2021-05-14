/* 
    Ruta: /api/usuarios
 */
const { Router } = require('express');
const { check } = require('express-validator');
const { checkCache, checkCacheComentario } = require('../middleware/checkCache');
const { crearComentario, listarComentariosByUsuario, calificarComentario, leerComentario } = require('../controllers/comentarios.controller');
const { validarCampos } = require('../middleware/validar-campos');

const router = Router();

router.post(
    '/', [
        check('emailUsuario', 'El email del usuario es obligatorio').not().isEmpty(),
        check('emailUsuario', 'El formato del email no es correcto').isEmail(),
        check('texto', 'El texto es obligatorio').not().isEmpty(),
        check('texto', 'El texto del comentario no puede ser mayor a 256').isLength({ max: 256 }),
        validarCampos,
    ],
    crearComentario
);

router.get(
    '/listaByUsuario/:email', [check('email', 'El email del usuario es obligatorio').not().isEmpty(), validarCampos],
     checkCache, listarComentariosByUsuario
);

router.post(
    '/emocion', [
        check('emailUsuario', 'El email del usuario es obligatorio').isEmail(),
        check('idComentario', 'El formato del id no es correcto').isMongoId(),
        check('idComentario', 'El ID del comentario es obligatorio').not().isEmpty(),
        check('calificacion', 'La calificacion es obligatoria').not().isEmpty(),
        // check('calificacion', 'La debe ser "Me gusta" o "No me gusta"').not().isIn(['Me gusta', 'No me gusta']),
        validarCampos,
    ],
    calificarComentario
);

router.get(
    '/leerComentario/:idComentario', [
        check('idComentario', 'El formato del ID no es correcto').isMongoId(),
        check('idComentario', 'El ID del comentario es obligatorio').not().isEmpty(),
        validarCampos
    ],
    checkCacheComentario, leerComentario
);

module.exports = router;