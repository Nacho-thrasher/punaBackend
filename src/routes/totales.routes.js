const router = require('express').Router();
const { getTotalesAnio, getTotalesMes, getTotalesDia, getTotalesEmpresa } = require("../controllers/totales.controllers");
const { validarJwt } = require('../middlewares/validarJwt');

router.get('/', [ validarJwt ], getTotalesAnio)
router.get('/:mes', [ validarJwt ], getTotalesMes)
router.get('/:mes/:dia', [ validarJwt ], getTotalesEmpresa)
router.get('/:mes/:dia/:empresa', [ validarJwt ], getTotalesDia)

module.exports = router;

// params /:mes/:dia/:empresa
// queries  localhost:/totales?nombre=nacho