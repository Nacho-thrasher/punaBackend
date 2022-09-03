// const jwt = require("jsonwebtoken");
const Usuario = require('../models/User');
const User_type = require('../models/User_type');

const validarADMIN_ROLE = async (req, res, next) => {

    const uid = req.uid;
    try {
        const usuarioDB = await Usuario.findById(uid);
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no encontrado'
            });
        }
        const user_typeDB = await User_type.findById(usuarioDB.user_type);
        if(user_typeDB.name === 'admin'){
            next();
        } else {
            return res.status(401).json({
                ok: false,
                msg: 'No tienes permisos para realizar esta acción'
            });
        }

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'No autorizado'
        })
    }

}
module.exports = {
    validarADMIN_ROLE,
}