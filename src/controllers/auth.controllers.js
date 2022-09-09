// login, renewToken
const bcrypt = require('bcrypt');
const Usuario = require("../models/User.js");
const User_type = require("../models/User_type.js");
const { generateJwt } = require('../helpers/generateJwt');
const { getMenuFrontEnd } = require('../helpers/menuFrontend')
const RegistroDiarioService = require('../services/registroDiario.services');
const VisadoService = require('../services/visado.services');

const login = async (req, res) => {
    const { userName, password } = req.body;
    console.log(userName, password);
    try {
        const userN = userName.toLowerCase().trim();
        const pass = password.trim();
        const existUser = await Usuario.findOne({ userName: userN })
        .populate('user_type', 'name')
        .exec();
        if (!existUser) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe'
            });
        }

        const validPassword = await bcrypt.compare(pass, existUser.password);
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
        //* variable aumentar dias
        const fechaMenos5 = new Date(new Date().setDate(new Date().getDate() - 5)).toLocaleDateString();
        //* buscar en registros all la fechamenos5
        const fechaMenos5_0 = fechaMenos5.split('/').map((item) => {
            if (item.length === 1) { return `0${item}`; }
            return item;
        }).join('/');
        const registros = await RegistroDiarioService.getRegistrosByDate(fechaMenos5_0);
        const userAdmin = await Usuario.findById('631a8f1ea02ee0048fc97ff9');
        //* recorrer y buscar si fue visado
        for (let index = 0; index < registros.length; index++) {
            const element = registros[index];
            // if (Object.keys(element.visado).length === 0) {
            //     //* si no fue visado visarlo
            //     const empresaId = element.usuario.empresa.uid;
            //     const fechaRegistro = element.date;
            //     const fechaVisado = new Date().toLocaleDateString('es-AR', {
            //         timeZone: 'America/Argentina/Buenos_Aires',
            //         day: '2-digit',
            //         month: '2-digit',
            //         year: 'numeric',
            //     }) 
            //     const usuario = userAdmin._id;
            //     const registroDiarioId = element._id;
            //     await VisadoService.createVisado(empresaId, fechaRegistro, fechaVisado, usuario, registroDiarioId);
            // } 
        }

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