const bcrypt              = require('bcrypt');
const User                = require("../models/User.js");
const User_type           = require("../models/User_type.js");
const { generateJwt }     = require('../helpers/generateJwt');
const { getMenuFrontEnd } = require('../helpers/menuFrontend')
const Company             = require('../models/Company');
const UserCompany         = require('../models/UserCompany');
//* 
const { getUserWithCompany, getAllUsersWithCompany, getAllUsers, postUser, getByDocument } = require('../services/user.services');
const { getById } = require('../services/company.services');
const { getByUserCompany, postUserCompany } = require('../services/userCompany.services');
const Types = require('../services/userTypes.services');

const userTypes = async (req, res) => {
    const { name, description } = req.body
    try {
        const userType = new User_type({
            name,
            description
        });
        const type =  await userType.save();
        res.status(200).json({
            type: type,
            message: 'User type created successfully'
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: `error: ${error}`,
        })
    }

}
const createUser = async (req, res) => {
    const { userName, firstName, lastName, email, password, image = 'https://res.cloudinary.com/hysmatafuegos/image/upload/v1659231938/user/user_djo46a.png', typeDocument, document, cuil } = req.body
    try {
        //* 1 existe el usuario?
        const existEmail = await User.findOne({ email });
        if (existEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El email ya existe'
            });
        }        
        //* 2 buscar el rol o tipo de usuario
        const user_type = await User_type.findOne({ name: 'user' }); 
        const usuario = new User({
            userName,firstName,lastName,email,password,user_type: user_type._id,image,typeDocument,document,cuil
        });
        //* 3 encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        usuario.password = bcrypt.hashSync(password, salt);
        //* 4 guardar el usuario
        await usuario.save();
        //* 5 buscar el usuario con su rol name y id
        const user = await User.findOne({ email })
            .populate('user_type', 'name')
            .exec();
        //* 6 generar el token
        const token = await generateJwt(user._id);
        //* 7 devolver el usuario
        return res.status(200).json({
            token,
            user,
            message: `Usuario ${user.userName} creado correctamente`,
            menu: getMenuFrontEnd(user.user_type.name),
        });    
    } 
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: `error: ${error}`,
        })
    }

}
const getUsers = async (req, res) => {

    const { page = 1, limit = 10 } = req.query; 
    const start = (page - 1) * limit;
    const end = page * limit;
    console.log(`paginacion vars: `,start, end);
    try {
        const users = await getAllUsers();
        return res.status(200).json({
            ok: true,
            users: users
        });
    
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: `error: ${error}`,
        })
    }

}
const getUserForType = async (req, res) => {
    const type = req.params.type;
    console.log(type);
    try {
        //! relacionar con usersCompanies para obtener la empresa con agregate
        const userWithCompany = await getAllUsersWithCompany(type);
        res.json({
            ok: true,
            users: userWithCompany
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: `error: ${error}`,
      })
    }
}
const updateUser = async (req, res) => {
    const id = req.params.id;
    const {
        firstName, lastName, empresaId, typeDocument, document, cuil, typeUser
    } = req.body;
    try {
        // quitar espacios adelante y atras, y camelcase
        // * buscar usuario por documento
        const user = await getByDocument(document);
        // * buscar user with company 
        const userCompany = await getUserWithCompany(user._id);
        // * Actuallizar usuario 
        const salt = await bcrypt.genSalt(10);
        let password = document;
        password = bcrypt.hashSync(password, salt);
        await User.findByIdAndUpdate(user._id, {
            userName: `${firstName.trim()} ${lastName.trim()}`,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            typeDocument,
            document,
            cuil,
            password: password,
            user_type: typeUser
        }, { new: true });
        // * Actualizar userCompany
        await UserCompany.findByIdAndUpdate(userCompany._id, {
            empresaId
        }, { new: true });
        // * devolver usuario
        const userUpdated = await getUserWithCompany(user._id);

        return res.status(200).json({
            ok: true,
            userUpdated
        }) 
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            message: `error: ${error}`,
        })
    }
}
const deleteUser = async (req, res) => {

}
const createUserWithCompany = async (req, res) => {
    const idCompany = req.params.idCompany;
    const type = req.params.userType;
    const { cuil, document, firstName, lastName, typeDocument, image = 'https://res.cloudinary.com/hysmatafuegos/image/upload/v1659231938/user/user_djo46a.png' } = req.body;
    try {
        console.log(idCompany);
        //* 1 buscar la empresa
        const company = await getById(idCompany);
        if (!company) {
            return res.status(404).json({
                ok: false,
                msg: 'La empresa no existe'
            });
        }
        //* 2 buscar el usuario por documento
        const userExist = await getByDocument(document);
        if (userExist) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya existe'
            });
        }
        //* 3 crear el usuario
        const newUser = await postUser(`${firstName} ${lastName}`, firstName, lastName, document, typeDocument, document, cuil, type, image);        
        if (!newUser) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no se pudo crear'
            });
        }
        //* 4 crear el usuario-empresa
        const newUserCompany = await postUserCompany(newUser._id, idCompany);
        if (!newUserCompany) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no se pudo crear'
            });
        }
        //* 5 buscar el usuario-empresa
        const userWithCompany = await getUserWithCompany(newUser._id, idCompany, type);
        //* 6 devolver el usuario-empresa
        return res.status(200).json({
            ok: true,
            user: userWithCompany            
        });      

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: `error: ${error}`,
        })
    }
}

const getUserTypes = async (req, res) => {
    try {
        const userTypes = await Types.getTypes();
        const data = userTypes.map(userType => {
            return {
                uid: userType._id,
                name: userType.name,
                description: userType.description
            }
        }).sort((a, b) => a.name.localeCompare(b.name));
        console.log(data);
        return res.status(200).json({
            ok: true,
            usersTypes: data
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: `error: ${error}`,
        })
    }
}

module.exports = { createUser, getUsers, updateUser, deleteUser, userTypes, getUserForType, createUserWithCompany, getUserTypes };