const router = require('express').Router();
const { check } = require('express-validator')
const { cambiarPassword, createUser, getUser, getUsers, updateUser, deleteUser, userTypes, getUserForType, createUserWithCompany, getUserTypes } = require("../controllers/users.controllers");
//* MIDDLEWARES - validaciones
const { validarCampos } = require('../middlewares/validar.campos.js');
const { validarJwt } = require('../middlewares/validarJwt.js');
const { validarADMIN_ROLE } = require('../middlewares/validarAdminRole.js');
//@-> validar si es suoervisor

// * posts
router.post(
    '/',
    [
        check('firstName', 'El nombre es obligatorio').not().isEmpty(),
        check('lastName', 'El apellido es obligatorio').not().isEmpty(),
        check('document', 'El documento es requerido y debe ser valido').not().isEmpty(),
        check('password', 'La contraseña es obligatoria').not().isEmpty(),
        validarCampos
    ],
    createUser
);
// @ -> crear usuario con compania
router.post('/:idCompany/:userType', createUserWithCompany)
// * usertypes routes
router.post('/types', userTypes)
router.get('/types', getUserTypes);
// * getters 
router.get('/', getUsers)
router.get('/:type', getUserForType)
// * update user
router.put('/:id', updateUser)
//* cambiar password
router.put('/password/:id', cambiarPassword)

module.exports = router;
