const router = require('express').Router();
const { getHoraComidaActual, createHoraComida, getHorasComidas, putHoraComida, getHoraComida, deleteHoraComida } = require("../controllers/horario.controllers");

router.post('/', createHoraComida);
router.get('/', getHorasComidas);
router.put('/:id', putHoraComida);
// router.get('/:id', getHoraComida);
router.get('/current-time', getHoraComidaActual);

module.exports = router;