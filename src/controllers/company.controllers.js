const User          = require("../models/User.js");
const Company       = require('../models/Company');
const UserCompany   = require('../models/UserCompany');

const getCompanyByCuit = async (cuit) => {
    try {
        // buscar cuit en empresa
        const company = await Company.findOne({ cuit });
        return company;

    } catch (error) {
        console.log(error)
        return null
    }
}

const createCompany = async (req, res) => {
    //? relacion con usuario en update
    const { name, idContratista, direction, description, cuit, city } = req.body;
    try {
        if (!idContratista) {
            // crear empresa
            const company = new Company({
                name: name.toLowerCase().trim(),
                direction: direction.toLowerCase().trim(),
                description: description.toLowerCase().trim(),
                cuit: cuit.toLowerCase().trim(),
                city: city.toLowerCase().trim()
            });
            // guardar empresa
            await company.save();
            return res.status(200).json({
                ok: true,
                data: company,
            });
        }
        else {
            const company = new Company({
                name: name.toLowerCase().trim(),
                direction: direction.toLowerCase().trim(),
                description: description.toLowerCase().trim(),
                cuit: cuit.toLowerCase().trim(),
                city: city.toLowerCase().trim(),
                contratista: idContratista
            });
            await company.save();
            return res.status(200).json({
                ok: true,
                data: company,
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: `error: ${error}`,
        })
    }

}
const getCompany = async (req, res) => {
    const { id } = req.params;
    try {
        //* 1 se encontro empresa
        const company = await Company.findById(id)
        if (!company) {
            return res.status(404).json({
                message: 'Empresa no encontrada o no existe.'
            });
        }
        //* 2 se encontro usuario
        const users = await UserCompany.find({ company: id });
        //* 3 mapear usuarios a empresa
        const usersCompany = users.map(user => user.user);
        const usersFound = await User.find({ _id: { $in: usersCompany } })
        .populate('user_type', 'name')
        
        return res.status(200).json({
            company,
            users: usersFound,
            message: 'Empresa encontrada correctamente'
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: `error: ${error}`,
        })
    }

}
const getCompanies = async (req, res) => {
    //@ agregate -> mongoDb
    const { page = 1, limit = 10 } = req.query; 
    const start = (page - 1) * limit;
    const end = page * limit;
    try {
        // agregate para empresa
        const companies = await Company.aggregate([
            {
                $lookup: {
                    // empresa 
                    from: 'companies',
                    // campo de la empresa
                    localField: 'contratista',
                    // campo de la empresa
                    foreignField: '_id',
                    // nombre de la propiedad
                    as: 'contratista'
                }
            },
            {
                $unwind: {
                    path: '$contratista',
                    preserveNullAndEmptyArrays: true
                }
            },
            // project -> seleccionar campos
            {
                $project: {
                    uid: '$_id',
                    name: 1,
                    description: 1,
                    city: 1,
                    direction: 1,
                    phone: 1,
                    cuit: 1,
                    image: 1,
                    contratista: {
                        uid: '$contratista._id',
                        name: 1,
                        description: 1,
                        city: 1,
                        direction: 1,
                        phone: 1,
                        cuit: 1,
                        image: 1,
                    }
                }
            }
        ])

        const total = await Company.countDocuments();
        const countPages = Math.ceil(total / limit);
        res.json({
            ok: true,
            empresas: companies,
            total,
            end,
            countPages
        });
    
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: `error: ${error}`,
        })
    }

}
const updateCompany = async (req, res) => {
    const { id } = req.params;
    const { idUser: user } = req.body;
    try {
        //* 1 se encontro empresa
        const company = await Company.findById(id);
        if (!company) {
            return res.status(404).json({
                message: 'Empresa no encontrada o no existe.'
            });
        }
        //* 2 se encontro usuario
        const userFound = await User.findById(user);
        if (!userFound) {
            return res.status(404).json({
                message: 'Usuario no existe.'
            });
        }
        //* 3 se agrega ambos id en UserCompany
        const userCompany = new UserCompany({
            user: userFound._id,
            company: company._id
        });
        await userCompany.save();
        // console.log(userCompany);

        //* 4 se actualiza la empresa con req.body
        const update = await Company.findByIdAndUpdate( id, req.body, { new: true })
        
        return res.status(200).json({
            company: update,
            user: userFound,
            message: 'Empresa actualizada correctamente'
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: `error: ${error}`,
        })
    }

}
const deleteCompany = async (req, res) => {

}

const putCompany = async (req, res) => {
    const id = req.params.id;
    const { name, idContratista, direction, description, cuit, city } = req.body;
    try {
        const company = await Company.findById(id);
        if (!company) {
            return res.status(404).json({
                message: 'Empresa no encontrada o no existe.'
            });
        }
        const args = {
            name: name.toLowerCase().trim(),
            direction: direction.toLowerCase().trim(),
            description: description.toLowerCase().trim(),
            cuit: cuit.toLowerCase().trim(),
            city: city.toLowerCase().trim(),
            contratista: idContratista
        }

        const update = await Company.findByIdAndUpdate( id, args, { new: true })
        
        return res.status(200).json({
            company: update,
            message: 'Empresa actualizada correctamente'
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: `error: ${error}`,
        })
    }
}

module.exports = { createCompany, getCompany, getCompanies, updateCompany, deleteCompany, putCompany }