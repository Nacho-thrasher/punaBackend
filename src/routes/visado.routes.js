const router = require('express').Router();

const { createVisado, getVisado, getVisados, updateVisado } = require("../controllers/visado.controllers");

router.post('/', createVisado)
router.get('/', getVisados)
router.get('/:id', getVisado)
router.put('/:id', updateVisado)

module.exports = router;