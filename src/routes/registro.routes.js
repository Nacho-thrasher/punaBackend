const router = require('express').Router();
const { createRegistroManual, createRegistro, getRegistro, getRegistros, updateRegistro, deleteRegistro, getRegistroByCompany } = require("../controllers/registroDiario.controllers");
const { validarJwt } = require('../middlewares/validarJwt.js');

router.post('/', [ validarJwt ], createRegistro)
router.post('/manual', [ validarJwt ], createRegistroManual)
router.put('/', updateRegistro)
router.get('/:id', getRegistro)
router.get('/', getRegistros)
router.get('/company/:idCompany', getRegistroByCompany)

module.exports = router;
