const User        = require("../models/User.js");
const Company     = require('../models/Company');
const UserCompany = require('../models/UserCompany');
const CompanyService = require('../services/company.services');
const UserService = require('../services/user.services');
const UserCompanyService = require('../services/userCompany.services');

const createComensalesExcel = async (req, res) => {
    // const { idContratista } = req.params;

    const idContratista = req.params.idContratista;
    // por el body viene un arrapy de objetos
    const { contratista, cuit, empleado, cuil, tipoDocumento, numeroDocumento } = req.body;
    try {
        if (!idContratista) {
            return res.status(400).json({
                ok: false,
                msg: 'No se ha enviado el id del contratista'
            })
        }
        const idRolComensal = '62e5dbe6817563c501736b19'
        //* 1 - buscar cuit en empresas si existe tomar id si no crearla
        const company = await CompanyService.getByCuit(cuit);
        if (!company || company == null) {
            //* 1 -2 si company no existe crearla 
            const newCompany = new Company({
                name: contratista,
                direction: 'sin direccion',
                description: 'sin descripcion',
                cuit: cuit,
                city: 'sin ciudad',
                contratista: idContratista
            });
            const idCompany = await newCompany.save();
            //* 1- 3 asignar variables
            const firstName = empleado.split(',')[1]
            const lastName = empleado.split(',')[0]
            // si cuil incluye guiones
            let document = numeroDocumento ? numeroDocumento : cuil.split;
            if (cuil.includes('-')) {
                document = cuil.split('-')[1];     
            }
            // const document = numeroDocumento ? numeroDocumento : cuil.split('-')[1];

            const tipoDocument = tipoDocumento ? tipoDocumento : 'DNI'
            //* 1- 4 si existe editarlo
            const user = await UserService.getByDocument(numeroDocumento ? numeroDocumento : cuil.split('-')[1]);
            if (user) {
                //* 1 -5 si existe el usuario editar relacion de empresa y usuario
                await UserService.actualizarUserAndUserCompany(
                    firstName, 
                    lastName, 
                    tipoDocument,
                    document,
                    cuil,
                    user._id,
                    idCompany._id,
                );
                return res.status(200).json({
                    ok: true,
                    msg: 'Usuario actualizado',
                })
            }
            //* 1 -5 si usuario no existe crearlo
            const newUser = await UserService.postUser(`${firstName} ${lastName}`, firstName, lastName, document, tipoDocument, document, cuil, idRolComensal);
            const newUserCompany = await UserCompanyService.postUserCompany(newUser._id, idCompany._id);
            return res.status(200).json({
                ok: true,
                message: 'Comensal creado correctamente',
            });
        } else {
            //* 1 -2 si compania existe, actualizar empresa
            const idCompany = company._id;
            await CompanyService.updateCompanyContratista(idCompany, idContratista);
            //* 1- 3 buscar usuario por documento
            const firstName = empleado.split(',')[1]
            const lastName = empleado.split(',')[0]
            console.log(firstName, lastName);
            const document = numeroDocumento ? numeroDocumento : cuil.split('-')[1];
            const tipoDocument = tipoDocumento ? tipoDocumento : 'DNI'
            const user = await UserService.getByDocument(numeroDocumento ? numeroDocumento : cuil.split('-')[1]);
            if (user) {
                //* 1 -3 si existe el usuario editar relacion de empresa y usuario
                await UserService.actualizarUserAndUserCompany(
                    firstName, 
                    lastName, 
                    tipoDocument,
                    document,
                    cuil,
                    user._id,
                    company._id,
                );
                return res.status(200).json({
                    ok: true,
                    msg: 'Usuario actualizado',
                })
            }
            const newUser = await UserService.postUser(`${lastName}`, firstName, lastName, document, tipoDocument, document, cuil, idRolComensal);
            const newUserCompany = await UserCompanyService.postUserCompany(newUser._id, company._id)
            return res.status(200).json({
                ok: true,
                message: 'Comensal creado correctamente',
            });
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok:false,
            msg: 'Error inesperado'
        })
    }
}

module.exports = { createComensalesExcel }