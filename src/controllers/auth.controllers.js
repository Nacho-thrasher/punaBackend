// login, renewToken
const bcrypt = require('bcrypt');
const Usuario = require("../models/User.js");
const User_type = require("../models/User_type.js");
const { generateJwt } = require('../helpers/generateJwt');
const { getMenuFrontEnd } = require('../helpers/menuFrontend')

const login = async (req, res) => {
    const { userName, password } = req.body;
    try {
        const existUser = await Usuario.findOne({ userName })
            .populate('user_type', 'name')
            .exec();
        if (!existUser) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe'
            });
        }
        
        const validPassword = await bcrypt.compare(password, existUser.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'La contraseña no es correcta'
            });
        }
        const token = await generateJwt(existUser._id);
        return res.status(200).json({
            ok: true,
            token,
            user: existUser,
            message: `Usuario ${existUser.userName} logueado correctamente`,
            menu: getMenuFrontEnd(existUser.user_type.name),
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado.'
        });
    }

}
const renewToken = async (req, res) => {

    try {
        const uid = req.uid;
        const token = await generateJwt(uid);
        const user = await Usuario.findById(uid)
        .populate('user_type', 'name')

        return res.status(200).json({
            ok: true,
            token,
            user,
            menu: getMenuFrontEnd(user.user_type.name),
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado.'
        });
    }

}

module.exports = { login, renewToken };