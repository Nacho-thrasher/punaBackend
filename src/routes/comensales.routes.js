const router = require('express').Router();
const { check } = require('express-validator')
const comensalesController = require("../controllers/comensales.controllers");

router.post('/excel', comensalesController.createComensalesExcel)

module.exports = router;