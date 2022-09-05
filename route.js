const { Router } = require('express');

const usersRouter = require("./src/routes/users.routes");
const authRouter = require("./src/routes/auth.routes");
const companyRouter = require("./src/routes/company.routes");
const menuRouter = require("./src/routes/menu.routes");
const registroDiarioRouter = require("./src/routes/registro.routes");
const horarioComidaRouter = require("./src/routes/horario.routes");
const totalesRouter = require('./src/routes/totales.routes');
const visadoRouter = require('./src/routes/visado.routes');
const comensalesRouter = require('./src/routes/comensales.routes');

const router = Router();

router.use('/users', usersRouter);
router.use('/auth', authRouter);
router.use('/company', companyRouter);
router.use('/menu', menuRouter);
router.use('/registro-diario', registroDiarioRouter);
router.use('/horarios-comida', horarioComidaRouter);
router.use('/totales', totalesRouter)
router.use('/visado', visadoRouter);
router.use('/comensales', comensalesRouter)

module.exports = router