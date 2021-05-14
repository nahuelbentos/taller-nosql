/* 
    Ruta: /api/usuarios
 */
const { Router } = require('express');
const { check } = require('express-validator');
const { crearUsuarios } = require('../controllers/usuarios.controller');
const { validarCampos } = require('../middleware/validar-campos');

const router = Router();

router.post(
    '/', [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El formato del mail no es correcto').isEmail(),
        validarCampos,
    ],
    crearUsuarios
);

module.exports = router;