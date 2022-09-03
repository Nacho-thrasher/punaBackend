const router = require('express').Router();
const { check } = require('express-validator')
//? controllers 
const { login, renewToken } = require("../controllers/auth.controllers");
const { validarCampos } = require('../middlewares/validar.campos.js');
const { validarJwt } = require('../middlewares/validarJwt');

router.post('/',
    [
        check('userName', 'El nombre de Usuario es requerido.').not().isEmpty(),
        check('password', 'La contraseña es requerida.').not().isEmpty(),
        validarCampos
    ],
    login
);
router.get('/renew', validarJwt, renewToken)

module.exports = router;