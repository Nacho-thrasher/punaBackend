const User        = require("../models/User.js");
const Company     = require('../models/Company');
const UserCompany = require('../models/UserCompany');
const CompanyService = require('../services/company.services');
const UserService = require('../services/user.services');
const UserCompanyService = require('../services/userCompany.services');

const createComensalesExcel = async (req, res) => {
    // por el body viene un array de objetos
    const { contratista, cuit, empleado, cuil, tipoDocumento, numeroDocumento } = req.body;
    try {
        const idPosco = '63156fa403228e85e73df6b6';
        const idRolComensal = '62e5dbe6817563c501736b19'
        //* 1 - buscar cuit en empresas si existe tomar id si no crearla
        // find or create
        const company = await CompanyService.getByCuit(cuit);
        
        if (!company || company == null) {
            //* 1 -2 si company no existe crearla 
            const newCompany = new Company({
                name: contratista,
                direction: 'sin direccion',
                description: 'sin descripcion',
                cuit: cuit,
                city: 'sin ciudad',
                contratista: idPosco
            });
            // obtener el id recien creado
            const idCompany = await newCompany.save();
            //* 1- 3 buscar usuario por documento o por cuil
            
            //* 1 -4 crear usuario
            const firstName = empleado.split(',')[1].trim()
            const lastName = empleado.split(',')[0].trim()
            // si document existe o tiene valor
            const document = numeroDocumento ? numeroDocumento : cuil.split('-')[1];
            const tipoDocument = tipoDocumento ? tipoDocumento : 'DNI'
            const newUser = await UserService.postUser(`${lastName}`, firstName, lastName, document, tipoDocument, document, cuil, idRolComensal);
            const newUserCompany = await UserCompanyService.postUserCompany(newUser._id, idCompany._id);
            return res.status(200).json({
                message: 'Comensal creado correctamente',
                newUserCompany
            });
        } else {
            // console.log(company)
            //* 1 -2 si compania existe 
            const firstName = empleado.split(',')[1].trim()
            const lastName = empleado.split(',')[0].trim()
            // si document existe o tiene valor
            const document = numeroDocumento ? numeroDocumento : cuil.split('-')[1];
            const tipoDocument = tipoDocumento ? tipoDocumento : 'DNI'
            const newUser = await UserService.postUser(`${lastName}`, firstName, lastName, document, tipoDocument, document, cuil, idRolComensal);
            const newUserCompany = await UserCompanyService.postUserCompany(newUser._id, company._id)
            return res.status(200).json({
                message: 'Comensal creado correctamente',
                newUserCompany
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