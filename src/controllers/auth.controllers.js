// login, renewToken
const bcrypt = require('bcrypt');
const Usuario = require("../models/User.js");
const User_type = require("../models/User_type.js");
const { generateJwt } = require('../helpers/generateJwt');
const { getMenuFrontEnd } = require('../helpers/menuFrontend')
const RegistroDiarioService = require('../services/registroDiario.services');
const VisadoService = require('../services/visado.services');
const UserService = require('../services/user.services');

const login = async (req, res) => {
    const { userName, password } = req.body;
    // console.log(userName, password);
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
        // const user = await Usuario.findById(uid)
        // .populate('user_type', 'name')
        const user = await UserService.getUserCompanyById(uid);
        if (!user) {
            return res.status(404).json({
                ok: false,
                msg: 'El usuario no existe'
            });
        }
        //* variable aumentar dias *//
        const fechaMenos5 = new Date(new Date().setDate(new Date().getDate() - 5)).toLocaleDateString();
        const fechaMenos5_0 = fechaMenos5.split('/').map((item) => {
            if (item.length === 1) { return `0${item}`; }
            return item;
        }).join('/');
        //* buscar en registros all la fechamenos5 *//
        const registros = await RegistroDiarioService.getRegistrosByDate(fechaMenos5_0);
        const userAdmin = await Usuario.findById('631a8f1ea02ee0048fc97ff9');
        //* reduce de registros.usuario.empresa.uid
        const empresas = registros.reduce((acc, item) => {
            if (!acc.find((item2) => (item2.uid).toString() == (item.usuario.empresa.uid).toString())) {
                acc.push({
                    ...item.usuario.empresa,
                    date: item.date,
                });
            }
            return acc;
        }, []);
        //* recorrer empresas y visar
        const fechaHoy = new Date().toLocaleDateString('es-Ar', { timeZone: 'America/Argentina/Buenos_Aires', day: '2-digit', month: '2-digit', year: 'numeric' });
        for (let i = 0; i < empresas.length; i++) {
            const empresa = empresas[i];
            await VisadoService.createVisado(
                empresa.uid, 
                empresa.date, 
                fechaHoy,
                userAdmin._id
            )
        }
        //* PRUEBA DE NOTIfICACIONES *//
        if (user.user_type.name == 'supervisor') {
            const regsForNotifs = await RegistroDiarioService.getRegistrosForNotifications(fechaMenos5_0, fechaHoy, user.empresa.uid)
            const regsForNotifsReduced = regsForNotifs.reduce((acc, item) => {
                if (!acc.find((item2) => (item2.date).toString() == (item.date).toString() && (item2.uid).toString() == (item.usuario.empresa.uid).toString())) {
                    const fechaMas5 = new Date(new Date(item.date.split('/').reverse().join('-')).setDate(new Date(item.date.split('/').reverse().join('-')).getDate() + 5))
                    .toLocaleDateString('es-Ar', { timeZone: 'America/Argentina/Buenos_Aires', day: '2-digit', month: '2-digit', year: 'numeric' });
                    acc.push({
                        ...item.usuario.empresa,
                        // empresaName: item.usuario.empresa.name,
                        date: item.date,
                        dateVencimiento: fechaMas5
                    });
                }
                return acc;
            }, []);
            let notifs = [];
            for (let index = 0; index < regsForNotifsReduced.length; index++) {
                const visado = await VisadoService.getVisadoByEmpresaAndDate(regsForNotifsReduced[index].uid, regsForNotifsReduced[index].date);
                if (!visado || visado.length === 0) {
                    notifs.push(regsForNotifsReduced[index]);
                }
            }

            return res.status(200).json({
                ok: true,
                token,
                user,
                menu: getMenuFrontEnd(user.user_type.name),
                notificaciones: notifs,
            })
        }
        return res.status(200).json({
            ok: true,
            token,
            user,
            menu: getMenuFrontEnd(user.user_type.name),
            notificaciones: null
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