const router = require('express').Router();
const { createRegistroManual, createRegistro, getRegistro, getRegistros, updateRegistro, deleteRegistro, getRegistroByCompany } = require("../controllers/registroDiario.controllers");

router.post('/', createRegistro)
router.post('/manual', createRegistroManual)
router.put('/', updateRegistro)
router.get('/:id', getRegistro)
router.get('/', getRegistros)
router.get('/company/:idCompany', getRegistroByCompany)

module.exports = router;
