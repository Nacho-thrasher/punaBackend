const User               = require("../models/User.js");
const User_type          = require("../models/User_type.js");
const Company            = require('../models/Company');
const UserCompany        = require('../models/UserCompany');
const bcrypt              = require('bcrypt');

const getAllUsers = async () => {
    try {
        const usersCompanies = await UserCompany.aggregate([
            { // #  lookup para obtener la empresa
                $lookup: {
                    from: 'companies',
                    localField: 'company',
                    foreignField: '_id',
                    as: 'company'
                },
            },
            { // #  unwind para mostrar como objeto 
                $unwind: {
                    path: '$company',
                    preserveNullAndEmptyArrays: true
                }
            },
            {   
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'user_types',
                                localField: 'user_type',
                                foreignField: '_id',
                                as: 'user_type'
                            },
                        },
                        {
                            $unwind: {
                                path: '$user_type',
                                preserveNullAndEmptyArrays: true
                            }
                        },
                    ]
                }
            },
            { 
                $unwind: {
                    path: '$user',
                    preserveNullAndEmptyArrays: true
                }
            }, 
            // DEVOLVER CON EMPRESA DENTRO DE USUARIO
            {
                $project: {
                        uid: '$user._id',
                        userName: '$user.userName',
                        firstName: '$user.firstName',
                        lastName: '$user.lastName',
                        email: '$user.email',
                        typeDocument: '$user.typeDocument',
                        document: '$user.document',
                        cuil: '$user.cuil',
                        image: '$user.image',
                        user_type: {
                            uid: '$user.user_type._id',
                            name: '$user.user_type.name',
                            description: '$user.user_type.description'
                        },
                        empresa: {
                            uid: '$company._id',
                            name: '$company.name',
                            description: '$company.description',
                            image: '$company.image',
                            city: '$company.city',
                            direction: '$company.direction',
                            phone: '$company.phone',
                            cuit: '$company.cuit',
                        }
                },
                
            }

        ]);
        return usersCompanies;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const getAllUsersWithCompany = async (userType) => {
    try {
        const usersCompanies = await UserCompany.aggregate([
            { // #  lookup para obtener la empresa
                $lookup: {
                    from: 'companies',
                    localField: 'company',
                    foreignField: '_id',
                    as: 'company'
                },
            },
            { // #  unwind para mostrar como objeto 
                $unwind: {
                    path: '$company',
                    preserveNullAndEmptyArrays: true
                }
            },
            {   
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'user_types',
                                localField: 'user_type',
                                foreignField: '_id',
                                as: 'user_type'
                            },
                        },
                        {
                            $unwind: {
                                path: '$user_type',
                                preserveNullAndEmptyArrays: true
                            }
                        },
                    ]
                }
            },
            { 
                $unwind: {
                    path: '$user',
                    preserveNullAndEmptyArrays: true
                }
            }, 
            { // #  filtramos por usertype
                $match: {
                    'user.user_type.name': userType,
                    // 'company._id': companyId
                }
            },
            // DEVOLVER CON EMPRESA DENTRO DE USUARIO
            {
                $project: {
                        uid: '$user._id',
                        userName: '$user.userName',
                        firstName: '$user.firstName',
                        lastName: '$user.lastName',
                        email: '$user.email',
                        typeDocument: '$user.typeDocument',
                        document: '$user.document',
                        cuil: '$user.cuil',
                        image: '$user.image',
                        user_type: {
                            _id: '$user.user_type._id',
                            name: '$user.user_type.name',
                            description: '$user.user_type.description'
                        },
                        empresa: {
                            uid: '$company._id',
                            name: '$company.name',
                            description: '$company.description',
                            image: '$company.image',
                            city: '$company.city',
                            direction: '$company.direction',
                            phone: '$company.phone',
                            cuit: '$company.cuit',
                        }
                },
                
            }

        ]);
        return usersCompanies;
    } catch (error) {
        console.log(error);
        return null;
    }
}
const getUserWithCompany = async (userId, companyId, userType) => {
    try {
        const usersCompanies = await UserCompany.aggregate([
            { // #  lookup para obtener la empresa
                $lookup: {
                    from: 'companies',
                    localField: 'company',
                    foreignField: '_id',
                    as: 'company'
                },
            },
            { // #  unwind para mostrar como objeto 
                $unwind: {
                    path: '$company',
                    preserveNullAndEmptyArrays: true
                }
            },
            {   // match con userId 
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user',
                    // pipeline para traer usertype
                    pipeline: [
                        {
                            $lookup: {
                                from: 'user_types',
                                localField: 'user_type',
                                foreignField: '_id',
                                as: 'user_type'
                            },
                        },
                        {
                            $unwind: {
                                path: '$user_type',
                                preserveNullAndEmptyArrays: true
                            }
                        },
                        // cargar aqui las empresas que el usuario tiene
                    ]
                }
            },
            { 
                $unwind: {
                    path: '$user',
                    preserveNullAndEmptyArrays: true
                }
            },
            // filtrar por id de usuario
            {
                $match: {
                    'user.document': userId,
                }
            },
            {
                $project: {
                    uid: '$user._id',
                    userName: '$user.userName',
                    firstName: '$user.firstName',
                    lastName: '$user.lastName',
                    email: '$user.email',
                    typeDocument: '$user.typeDocument',
                    document: '$user.document',
                    cuil: '$user.cuil',
                    image: '$user.image',
                    user_type: {
                        _id: '$user.user_type._id',
                        name: '$user.user_type.name',
                        description: '$user.user_type.description'
                    },
                    empresa: {
                        uid: '$company._id',
                        name: '$company.name',
                        description: '$company.description',
                        image: '$company.image',
                        city: '$company.city',
                        direction: '$company.direction',
                        phone: '$company.phone',
                        cuit: '$company.cuit',
                    }
                },
                
            }

        ]);
        return usersCompanies;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const getById = async (id) => {
    try {
        const user = await User.findById(id)
        .populate('user_type')

        return user;
    } catch (error) {
        console.log(error);
        return null;
    }
}
const getByEmail = async (email) => {
    try {
        const user = await User.findOne({email: email});
        return user;
    } catch (error) {
        console.log(error);
        return null;
    }
}
const getByDocument = async (document) => {
    try {
        const user = await User.findOne({document: document});
        if (!user) return null;
        return user;
    } catch (error) {
        console.log(error);
        return null;
    }
}
const postUser = async (
    userName, 
    firstName, 
    lastName, 
    password, 
    typeDocument, 
    document,
    cuil, 
    typeUser, 
    image = ''
) => {
    try {
        console.log(`aqui variables: `,typeUser)
        // findById para traer el usertype
        const type = await User_type.findById(typeUser);
        console.log(`aqui type: `,type)
        const user = new User({
            userName: userName,
            firstName: firstName,
            lastName: lastName,
            password: password,
            typeDocument: typeDocument,
            image: image,
            document: document,
            cuil: cuil,
            user_type: type._id,
        });
        
        const salt = await bcrypt.genSalt(10);
        user.password = bcrypt.hashSync(password, salt);
        const newUser = await user.save();
        return newUser;
    } catch (error) {
        console.log(error);
        return null;
    }    
}

const actualizarUserAndUserCompany = async (
    firstName, 
    lastName, 
    typeDocument, 
    document, 
    cuil, 
    idUser, 
    idCompany
) => {
    try {
        //* 1 actualizar user
        const user = await User.findByIdAndUpdate(idUser, {
            userName: `${firstName} ${lastName}`,
            firstName: firstName,
            lastName: lastName,
            typeDocument: typeDocument,
            document: document,
            cuil: cuil,
        }, {new: true});
        //* 2 actualizar userCompany buscar por idUser
        const userCompany = await UserCompany.findOneAndUpdate({user: idUser}, {
            company: idCompany,
        }, {new: true});
        return true;
        
    } catch (error) {
        console.log(error);
        return null;
    }
}

module.exports = { actualizarUserAndUserCompany, getUserWithCompany, getById, getByEmail, postUser, getAllUsersWithCompany, getByDocument, getAllUsers };