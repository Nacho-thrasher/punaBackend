const mongoose = require('mongoose');
const RegistroDiario = require('../models/RegistroDiario');

const createRegistroDiario = async(data)=>{
    try{
        
        const registroDiario = new RegistroDiario(data);
        const newRegistroDiario = await registroDiario.save();
        return newRegistroDiario;
        
    }catch(error){
        console.log(error);
        return null;
    }
}
const getAllRegistroDiarioNoAdmin = async (idContractor) => {
    try {
        const registrosDiarios = await RegistroDiario.aggregate([
            {
                $unwind: {
                    path: '$user_companies',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    // type es de Menu
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
                        }
                    ]
                },
            },
            {
                $unwind: {
                    path: '$user',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    // type es de Menu
                    from: 'companies',
                    localField: 'company',
                    foreignField: '_id',
                    as: 'company',
                    // pipeline para contratista
                    pipeline: [
                        {
                            $lookup: {
                                from: 'companies',
                                localField: 'contratista',
                                foreignField: '_id',
                                as: 'contratista'
                            },
                        },
                        {
                            $unwind: {
                                path: '$contratista',
                                preserveNullAndEmptyArrays: true
                            }
                        },
                    ]
                }
            },
            {
                $unwind: {
                    path: '$company',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'menus',
                    localField: 'type',
                    foreignField: '_id',
                    as: 'menu',
                }
            },
            {
                $unwind: {
                    path: '$menu',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'breakfasts',
                    localField: 'breakfast',
                    foreignField: '_id',
                    as: 'breakfast',
                }
            },
            {
                $unwind: {
                    path: '$breakfast',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'lunches',
                    localField: 'lunch',
                    foreignField: '_id',
                    as: 'lunch',
                }
            },
            {
                $unwind: {
                    path: '$lunch',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'dinners',
                    localField: 'dinner',
                    foreignField: '_id',
                    as: 'dinner',
                }
            },
            {
                $unwind: {
                    path: '$dinner',
                    preserveNullAndEmptyArrays: true
                } 
            },
            {
                $lookup: {
                    from: 'afternoonsnacks',
                    localField: 'afternoonSnack',
                    foreignField: '_id',
                    as: 'afternoonSnack',
                    
                }
            },
            {
                $unwind: {
                    path: '$afternoonSnack',
                    preserveNullAndEmptyArrays: true,
                    includeArrayIndex: 'afternoonSnackIndex',
                }
            },
            // match para filtrar donde company.contratista igual a id
            {
                $match: {
                    'company.contratista.cuit': idContractor
                }
            },
            {
                $project: {
                    uid: '$_id',
                    date: '$date',
                    time: '$time',
                    menu: { // menu
                        uid: '$menu._id',
                        date: '$menu.date',
                        type: '$menu.type',
                    },
                    breakfast: { // breakfast
                        uid: '$breakfast._id',
                        dish: '$breakfast.dish',
                    },
                    lunch: { // lunch
                        uid: '$lunch._id',
                        dish: '$lunch.dish',
                    },
                    afternoonSnack: { // afternoonSnack
                        uid: '$afternoonSnack._id',
                        dish: '$afternoonSnack.dish',
                    },
                    dinner: { // dinner
                        uid: '$dinner._id',
                        dish: '$dinner.dish',
                    },
                    usuario: { // user
                        uid: '$user._id',
                        userName: '$user.userName',
                        document: '$user.document',
                        firstName: '$user.firstName',
                        lastName: '$user.lastName',
                        email: '$user.email',
                        typeDocument: '$user.typeDocument',
                        cuil: '$user.cuil',
                        image: '$user.image',
                        empresa: {
                            uid: '$company._id',
                            name: '$company.name',
                            description: '$company.description',
                            city: '$company.city',
                            direction: '$company.direction',
                            cuit: '$company.cuit',
                            contratista: {
                                uid: '$company.contratista._id',
                                name: '$company.contratista.name',
                                description: '$company.contratista.description',
                                city: '$company.contratista.city',
                                direction: '$company.contratista.direction',
                                cuit: '$company.contratista.cuit',
                            }
                        },
                        user_type: {
                            uid: '$user.user_type._id',
                            name: '$user.user_type.name',
                        }
                    },
                        
                },
                
            }
        ]);
        // console.log(registrosDiarios);
        return registrosDiarios;

    } catch (error) {
        console.log(error);
        return null;
    }
}
const getAllRegistrosDiarios = async()=>{
    try {
        const registrosDiarios = await RegistroDiario.aggregate([
            {
                $unwind: {
                    path: '$user_companies',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    // type es de Menu
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
                        }
                    ]
                },
            },
            {
                $unwind: {
                    path: '$user',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    // type es de Menu
                    from: 'companies',
                    localField: 'company',
                    foreignField: '_id',
                    as: 'company',
                }
            },
            {
                $unwind: {
                    path: '$company',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'menus',
                    localField: 'type',
                    foreignField: '_id',
                    as: 'menu',
                }
            },
            {
                $unwind: {
                    path: '$menu',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'breakfasts',
                    localField: 'breakfast',
                    foreignField: '_id',
                    as: 'breakfast',
                }
            },
            {
                $unwind: {
                    path: '$breakfast',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'lunches',
                    localField: 'lunch',
                    foreignField: '_id',
                    as: 'lunch',
                }
            },
            {
                $unwind: {
                    path: '$lunch',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'dinners',
                    localField: 'dinner',
                    foreignField: '_id',
                    as: 'dinner',
                }
            },
            {
                $unwind: {
                    path: '$dinner',
                    preserveNullAndEmptyArrays: true
                } 
            },
            {
                $lookup: {
                    from: 'afternoonsnacks',
                    localField: 'afternoonSnack',
                    foreignField: '_id',
                    as: 'afternoonSnack',
                    
                }
            },
            {
                $unwind: {
                    path: '$afternoonSnack',
                    preserveNullAndEmptyArrays: true,
                    includeArrayIndex: 'afternoonSnackIndex',
                }
            },
            // buscar eb campo createdBy el usuario que creo el registro
            {
                $lookup: {
                    from: 'users',
                    localField: 'createdBy',
                    foreignField: '_id',
                    as: 'createdBy',
                } 
            },
            {
                $unwind: {
                    path: '$createdBy',
                    preserveNullAndEmptyArrays: true,
                }
            },
            {
                $project: {
                    uid: '$_id',
                    date: '$date',
                    time: '$time',
                    menu: { // menu
                        uid: '$menu._id',
                        date: '$menu.date',
                        type: '$menu.type',
                    },
                    breakfast: { // breakfast
                        uid: '$breakfast._id',
                        dish: '$breakfast.dish',
                    },
                    lunch: { // lunch
                        uid: '$lunch._id',
                        dish: '$lunch.dish',
                    },
                    afternoonSnack: { // afternoonSnack
                        uid: '$afternoonSnack._id',
                        dish: '$afternoonSnack.dish',
                    },
                    dinner: { // dinner
                        uid: '$dinner._id',
                        dish: '$dinner.dish',
                    },
                    usuario: { // user
                        uid: '$user._id',
                        userName: '$user.userName',
                        document: '$user.document',
                        firstName: '$user.firstName',
                        lastName: '$user.lastName',
                        email: '$user.email',
                        typeDocument: '$user.typeDocument',
                        cuil: '$user.cuil',
                        image: '$user.image',
                        empresa: {
                            uid: '$company._id',
                            name: '$company.name',
                            description: '$company.description',
                            city: '$company.city',
                            direction: '$company.direction',
                        },
                        user_type: {
                            uid: '$user.user_type._id',
                            name: '$user.user_type.name',
                        }
                    },
                    createdBy: {
                        uid: '$createdBy._id',
                        userName: '$createdBy.userName',
                        document: '$createdBy.document',
                        firstName: '$createdBy.firstName',
                        lastName: '$createdBy.lastName',
                    }
                },
                
            }
        ]);
        return registrosDiarios;

    } catch (error) {
        console.log(error);
        return null;
    }
}
const getAllRegistrosDiariosToday = async(dateToday)=>{
    try {
        const registrosDiarios = await RegistroDiario.aggregate([
            {
                $unwind: {
                    path: '$user_companies',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    // type es de Menu
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
                        }
                    ]
                },
            },
            {
                $unwind: {
                    path: '$user',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    // type es de Menu
                    from: 'companies',
                    localField: 'company',
                    foreignField: '_id',
                    as: 'company',
                }
            },
            {
                $unwind: {
                    path: '$company',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'menus',
                    localField: 'type',
                    foreignField: '_id',
                    as: 'menu',
                }
            },
            {
                $unwind: {
                    path: '$menu',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'breakfasts',
                    localField: 'breakfast',
                    foreignField: '_id',
                    as: 'breakfast',
                }
            },
            {
                $unwind: {
                    path: '$breakfast',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'lunches',
                    localField: 'lunch',
                    foreignField: '_id',
                    as: 'lunch',
                }
            },
            {
                $unwind: {
                    path: '$lunch',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'dinners',
                    localField: 'dinner',
                    foreignField: '_id',
                    as: 'dinner',
                }
            },
            {
                $unwind: {
                    path: '$dinner',
                    preserveNullAndEmptyArrays: true
                } 
            },
            {
                $lookup: {
                    from: 'afternoonsnacks',
                    localField: 'afternoonSnack',
                    foreignField: '_id',
                    as: 'afternoonSnack',
                    
                }
            },
            {
                $unwind: {
                    path: '$afternoonSnack',
                    preserveNullAndEmptyArrays: true,
                    includeArrayIndex: 'afternoonSnackIndex',
                }
            },
            {
                $match: {
                    date: {
                        $eq: dateToday
                    }
                }
            },
            {
                $project: {
                    uid: '$_id',
                    date: '$date',
                    time: '$time',
                    menu: { // menu
                        uid: '$menu._id',
                        date: '$menu.date',
                        type: '$menu.type',
                    },
                    breakfast: { // breakfast
                        uid: '$breakfast._id',
                        dish: '$breakfast.dish',
                    },
                    lunch: { // lunch
                        uid: '$lunch._id',
                        dish: '$lunch.dish',
                    },
                    afternoonSnack: { // afternoonSnack
                        uid: '$afternoonSnack._id',
                        dish: '$afternoonSnack.dish',
                    },
                    dinner: { // dinner
                        uid: '$dinner._id',
                        dish: '$dinner.dish',
                    },
                    usuario: { // user
                        uid: '$user._id',
                        userName: '$user.userName',
                        document: '$user.document',
                        firstName: '$user.firstName',
                        lastName: '$user.lastName',
                        email: '$user.email',
                        typeDocument: '$user.typeDocument',
                        cuil: '$user.cuil',
                        image: '$user.image',
                        empresa: {
                            uid: '$company._id',
                            name: '$company.name',
                            description: '$company.description',
                            city: '$company.city',
                            direction: '$company.direction',
                        },
                        user_type: {
                            uid: '$user.user_type._id',
                            name: '$user.user_type.name',
                        }
                    },
                        
                },  
            }
        ]);
        return registrosDiarios;

    } catch (error) {
        console.log(error);
        return null;
    }
}
const getRegistrosByCompanyAndDate = async(company)=>{
    try {
        const registrosDiarios = await RegistroDiario.aggregate([
            {
                $unwind: {
                    path: '$user_companies',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    // type es de Menu
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
                        }
                    ]
                },
            },
            {
                $unwind: {
                    path: '$user',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    // type es de Menu
                    from: 'companies',
                    localField: 'company',
                    foreignField: '_id',
                    as: 'company',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'companies',
                                localField: 'contratista',
                                foreignField: '_id',
                                as: 'contratista'
                            },
                        },
                        {
                            $unwind: {
                                path: '$contratista',
                                preserveNullAndEmptyArrays: true
                            }
                        },
                    ]
                }
            },
            {
                $unwind: {
                    path: '$company',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'menus',
                    localField: 'type',
                    foreignField: '_id',
                    as: 'menu',
                }
            },
            {
                $unwind: {
                    path: '$menu',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'breakfasts',
                    localField: 'breakfast',
                    foreignField: '_id',
                    as: 'breakfast',
                }
            },
            {
                $unwind: {
                    path: '$breakfast',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'lunches',
                    localField: 'lunch',
                    foreignField: '_id',
                    as: 'lunch',
                }
            },
            {
                $unwind: {
                    path: '$lunch',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'dinners',
                    localField: 'dinner',
                    foreignField: '_id',
                    as: 'dinner',
                }
            },
            {
                $unwind: {
                    path: '$dinner',
                    preserveNullAndEmptyArrays: true
                } 
            },
            {
                $lookup: {
                    from: 'afternoonsnacks',
                    localField: 'afternoonSnack',
                    foreignField: '_id',
                    as: 'afternoonSnack',
                }
            },
            {
                $unwind: {
                    path: '$afternoonSnack',
                    preserveNullAndEmptyArrays: true
                }
            },
            // MATCH POR COMPANY ID
            {
                $match: {
                    'company._id': company,
                }
            },
            {
                $project: {
                    uid: '$_id',
                    date: '$date',
                    time: '$time',
                    menu: { // menu
                        uid: '$menu._id',
                        date: '$menu.date',
                        type: '$menu.type',
                    },
                    breakfast: { // breakfast
                        uid: '$breakfast._id',
                        dish: '$breakfast.dish',
                    },
                    lunch: { // lunch
                        uid: '$lunch._id',
                        dish: '$lunch.dish',
                    },
                    afternoonSnack: { // afternoonSnack
                        uid: '$afternoonSnack._id',
                        dish: '$afternoonSnack.dish',
                    },
                    dinner: { // dinner
                        uid: '$dinner._id',
                        dish: '$dinner.dish',
                    },
                    usuario: { // user
                        uid: '$user._id',
                        userName: '$user.userName',
                        document: '$user.document',
                        firstName: '$user.firstName',
                        lastName: '$user.lastName',
                        email: '$user.email',
                        typeDocument: '$user.typeDocument',
                        cuil: '$user.cuil',
                        image: '$user.image',
                        empresa: {
                            uid: '$company._id',
                            name: '$company.name',
                            description: '$company.description',
                            city: '$company.city',
                            direction: '$company.direction',
                            cuit: '$company.cuit',
                            contratista: {
                                uid: '$company.contratista._id',
                                name: '$company.contratista.name',
                                description: '$company.contratista.description',
                                city: '$company.contratista.city',
                                direction: '$company.contratista.direction',
                                cuit: '$company.contratista.cuit',
                            }
                        },
                        user_type: {
                            uid: '$user.user_type._id',
                            name: '$user.user_type.name',
                        }
                    },
                        
                },
                
            }
            
            

        ]);
        console.log(`aqui respuesta: `,registrosDiarios);
        return registrosDiarios;

    } catch (error) {
        console.log(error);
        return null;
    }
}
const getRegistrosByCompanyAndDateNoAdmin = async(company, contratista)=>{
    try {
        const registrosDiarios = await RegistroDiario.aggregate([
            {
                $unwind: {
                    path: '$user_companies',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    // type es de Menu
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
                        }
                    ]
                },
            },
            {
                $unwind: {
                    path: '$user',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    // type es de Menu
                    from: 'companies',
                    localField: 'company',
                    foreignField: '_id',
                    as: 'company',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'companies',
                                localField: 'contratista',
                                foreignField: '_id',
                                as: 'contratista'
                            },
                        },
                        {
                            $unwind: {
                                path: '$contratista',
                                preserveNullAndEmptyArrays: true
                            }
                        },
                    ]
                }
            },
            {
                $unwind: {
                    path: '$company',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'menus',
                    localField: 'type',
                    foreignField: '_id',
                    as: 'menu',
                }
            },
            {
                $unwind: {
                    path: '$menu',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'breakfasts',
                    localField: 'breakfast',
                    foreignField: '_id',
                    as: 'breakfast',
                }
            },
            {
                $unwind: {
                    path: '$breakfast',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'lunches',
                    localField: 'lunch',
                    foreignField: '_id',
                    as: 'lunch',
                }
            },
            {
                $unwind: {
                    path: '$lunch',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'dinners',
                    localField: 'dinner',
                    foreignField: '_id',
                    as: 'dinner',
                }
            },
            {
                $unwind: {
                    path: '$dinner',
                    preserveNullAndEmptyArrays: true
                } 
            },
            {
                $lookup: {
                    from: 'afternoonsnacks',
                    localField: 'afternoonSnack',
                    foreignField: '_id',
                    as: 'afternoonSnack',
                }
            },
            {
                $unwind: {
                    path: '$afternoonSnack',
                    preserveNullAndEmptyArrays: true
                }
            },
            // MATCH POR COMPANY ID
            {
                $match: {
                    'company._id': company,
                    'company.contratista.cuit': contratista,
                }
            },
            {
                $project: {
                    uid: '$_id',
                    date: '$date',
                    time: '$time',
                    menu: { // menu
                        uid: '$menu._id',
                        date: '$menu.date',
                        type: '$menu.type',
                    },
                    breakfast: { // breakfast
                        uid: '$breakfast._id',
                        dish: '$breakfast.dish',
                    },
                    lunch: { // lunch
                        uid: '$lunch._id',
                        dish: '$lunch.dish',
                    },
                    afternoonSnack: { // afternoonSnack
                        uid: '$afternoonSnack._id',
                        dish: '$afternoonSnack.dish',
                    },
                    dinner: { // dinner
                        uid: '$dinner._id',
                        dish: '$dinner.dish',
                    },
                    usuario: { // user
                        uid: '$user._id',
                        userName: '$user.userName',
                        document: '$user.document',
                        firstName: '$user.firstName',
                        lastName: '$user.lastName',
                        email: '$user.email',
                        typeDocument: '$user.typeDocument',
                        cuil: '$user.cuil',
                        image: '$user.image',
                        empresa: {
                            uid: '$company._id',
                            name: '$company.name',
                            description: '$company.description',
                            city: '$company.city',
                            direction: '$company.direction',
                            cuit: '$company.cuit',
                            contratista: {
                                uid: '$company.contratista._id',
                                name: '$company.contratista.name',
                                description: '$company.contratista.description',
                                city: '$company.contratista.city',
                                direction: '$company.contratista.direction',
                                cuit: '$company.contratista.cuit',
                            }
                        },
                        user_type: {
                            uid: '$user.user_type._id',
                            name: '$user.user_type.name',
                        }
                    },
                        
                },
                
            }
            
            

        ]);
        console.log(`aqui respuesta: `,registrosDiarios);
        return registrosDiarios;

    } catch (error) {
        console.log(error);
        return null;
    }
}
const getRegistrosByDate = async(date)=>{
    try {
        const registrosDiarios = await RegistroDiario.aggregate([
            {
                $unwind: {
                    path: '$user_companies',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    // type es de Menu
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
                        }
                    ]
                },
            },
            {
                $unwind: {
                    path: '$user',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    // type es de Menu
                    from: 'companies',
                    localField: 'company',
                    foreignField: '_id',
                    as: 'company',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'companies',
                                localField: 'contratista',
                                foreignField: '_id',
                                as: 'contratista'
                            },
                        },
                        {
                            $unwind: {
                                path: '$contratista',
                                preserveNullAndEmptyArrays: true
                            }
                        },
                    ]
                }
            },
            {
                $unwind: {
                    path: '$company',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'menus',
                    localField: 'type',
                    foreignField: '_id',
                    as: 'menu',
                }
            },
            {
                $unwind: {
                    path: '$menu',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'breakfasts',
                    localField: 'breakfast',
                    foreignField: '_id',
                    as: 'breakfast',
                }
            },
            {
                $unwind: {
                    path: '$breakfast',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'lunches',
                    localField: 'lunch',
                    foreignField: '_id',
                    as: 'lunch',
                }
            },
            {
                $unwind: {
                    path: '$lunch',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'dinners',
                    localField: 'dinner',
                    foreignField: '_id',
                    as: 'dinner',
                }
            },
            {
                $unwind: {
                    path: '$dinner',
                    preserveNullAndEmptyArrays: true
                } 
            },
            {
                $lookup: {
                    from: 'afternoonsnacks',
                    localField: 'afternoonSnack',
                    foreignField: '_id',
                    as: 'afternoonSnack',
                }
            },
            {
                $unwind: {
                    path: '$afternoonSnack',
                    preserveNullAndEmptyArrays: true
                }
            },
            // MATCH POR date
            {
                $match: {
                    date: date,
                }
            },
            {
                $project: {
                    uid: '$_id',
                    date: '$date',
                    time: '$time',
                    menu: { // menu
                        uid: '$menu._id',
                        date: '$menu.date',
                        type: '$menu.type',
                    },
                    breakfast: { // breakfast
                        uid: '$breakfast._id',
                        dish: '$breakfast.dish',
                    },
                    lunch: { // lunch
                        uid: '$lunch._id',
                        dish: '$lunch.dish',
                    },
                    afternoonSnack: { // afternoonSnack
                        uid: '$afternoonSnack._id',
                        dish: '$afternoonSnack.dish',
                    },
                    dinner: { // dinner
                        uid: '$dinner._id',
                        dish: '$dinner.dish',
                    },
                    usuario: { // user
                        uid: '$user._id',
                        userName: '$user.userName',
                        document: '$user.document',
                        firstName: '$user.firstName',
                        lastName: '$user.lastName',
                        email: '$user.email',
                        typeDocument: '$user.typeDocument',
                        cuil: '$user.cuil',
                        image: '$user.image',
                        empresa: {
                            uid: '$company._id',
                            name: '$company.name',
                            description: '$company.description',
                            city: '$company.city',
                            direction: '$company.direction',
                            cuit: '$company.cuit',
                            contratista: {
                                uid: '$company.contratista._id',
                                name: '$company.contratista.name',
                                description: '$company.contratista.description',
                                city: '$company.contratista.city',
                                direction: '$company.contratista.direction',
                                cuit: '$company.contratista.cuit',
                            }
                        },
                        user_type: {
                            uid: '$user.user_type._id',
                            name: '$user.user_type.name',
                        }
                    }
                        
                },
            }
        ]);
        
        return registrosDiarios;

    } catch (error) {
        console.log(error);
        return null;
    }
}
const getRegistrosByDateNoAdmin = async(date, contratista)=>{
    try {
        const registrosDiarios = await RegistroDiario.aggregate([
            {
                $unwind: {
                    path: '$user_companies',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    // type es de Menu
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
                        }
                    ]
                },
            },
            {
                $unwind: {
                    path: '$user',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    // type es de Menu
                    from: 'companies',
                    localField: 'company',
                    foreignField: '_id',
                    as: 'company',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'companies',
                                localField: 'contratista',
                                foreignField: '_id',
                                as: 'contratista'
                            },
                        },
                        {
                            $unwind: {
                                path: '$contratista',
                                preserveNullAndEmptyArrays: true
                            }
                        },
                        
                    ]
                }
            },
            {
                $unwind: {
                    path: '$company',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'menus',
                    localField: 'type',
                    foreignField: '_id',
                    as: 'menu',
                }
            },
            {
                $unwind: {
                    path: '$menu',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'breakfasts',
                    localField: 'breakfast',
                    foreignField: '_id',
                    as: 'breakfast',
                }
            },
            {
                $unwind: {
                    path: '$breakfast',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'lunches',
                    localField: 'lunch',
                    foreignField: '_id',
                    as: 'lunch',
                }
            },
            {
                $unwind: {
                    path: '$lunch',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'dinners',
                    localField: 'dinner',
                    foreignField: '_id',
                    as: 'dinner',
                }
            },
            {
                $unwind: {
                    path: '$dinner',
                    preserveNullAndEmptyArrays: true
                } 
            },
            {
                $lookup: {
                    from: 'afternoonsnacks',
                    localField: 'afternoonSnack',
                    foreignField: '_id',
                    as: 'afternoonSnack',
                }
            },
            {
                $unwind: {
                    path: '$afternoonSnack',
                    preserveNullAndEmptyArrays: true
                }
            },
            //  

            // MATCH POR date y por contratista
            {
                $match: {
                    date: date,
                    'company.contratista.cuit': contratista,
                }
            },
            {
                $project: {
                    uid: '$_id',
                    date: '$date',
                    time: '$time',
                    menu: { // menu
                        uid: '$menu._id',
                        date: '$menu.date',
                        type: '$menu.type',
                    },
                    breakfast: { // breakfast
                        uid: '$breakfast._id',
                        dish: '$breakfast.dish',
                    },
                    lunch: { // lunch
                        uid: '$lunch._id',
                        dish: '$lunch.dish',
                    },
                    afternoonSnack: { // afternoonSnack
                        uid: '$afternoonSnack._id',
                        dish: '$afternoonSnack.dish',
                    },
                    dinner: { // dinner
                        uid: '$dinner._id',
                        dish: '$dinner.dish',
                    },
                    usuario: { // user
                        uid: '$user._id',
                        userName: '$user.userName',
                        document: '$user.document',
                        firstName: '$user.firstName',
                        lastName: '$user.lastName',
                        email: '$user.email',
                        typeDocument: '$user.typeDocument',
                        cuil: '$user.cuil',
                        image: '$user.image',
                        empresa: {
                            uid: '$company._id',
                            name: '$company.name',
                            description: '$company.description',
                            city: '$company.city',
                            direction: '$company.direction',
                            cuit: '$company.cuit',
                            contratista: {
                                uid: '$company.contratista._id',
                                name: '$company.contratista.name',
                                description: '$company.contratista.description',
                                city: '$company.contratista.city',
                                direction: '$company.contratista.direction',
                                cuit: '$company.contratista.cuit',
                            }
                        },
                        user_type: {
                            uid: '$user.user_type._id',
                            name: '$user.user_type.name',
                        }
                    }
                        
                },
            }
        ]);
        console.log(`aqui respuesta: `,registrosDiarios);
        return registrosDiarios;

    } catch (error) {
        console.log(error);
        return null;
    }
}
const getRegistrosForNotifications = async(minDate, maxDate, EmpresaContratista)=>{
    try {
        const registrosDiarios = await RegistroDiario.aggregate([
            {
                $unwind: {
                    path: '$user_companies',
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
                        }
                    ]
                },
            },
            {
                $unwind: {
                    path: '$user',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'companies',
                    localField: 'company',
                    foreignField: '_id',
                    as: 'company',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'companies',
                                localField: 'contratista',
                                foreignField: '_id',
                                as: 'contratista'
                            },
                        },
                        {
                            $unwind: {
                                path: '$contratista',
                                preserveNullAndEmptyArrays: true
                            }
                        },
                    ]
                }
            },
            {
                $unwind: {
                    path: '$company',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'menus',
                    localField: 'type',
                    foreignField: '_id',
                    as: 'menu',
                }
            },
            {
                $unwind: {
                    path: '$menu',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'breakfasts',
                    localField: 'breakfast',
                    foreignField: '_id',
                    as: 'breakfast',
                }
            },
            {
                $unwind: {
                    path: '$breakfast',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'lunches',
                    localField: 'lunch',
                    foreignField: '_id',
                    as: 'lunch',
                }
            },
            {
                $unwind: {
                    path: '$lunch',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'dinners',
                    localField: 'dinner',
                    foreignField: '_id',
                    as: 'dinner',
                }
            },
            {
                $unwind: {
                    path: '$dinner',
                    preserveNullAndEmptyArrays: true
                } 
            },
            {
                $lookup: {
                    from: 'afternoonsnacks',
                    localField: 'afternoonSnack',
                    foreignField: '_id',
                    as: 'afternoonSnack',
                }
            },
            {
                $unwind: {
                    path: '$afternoonSnack',
                    preserveNullAndEmptyArrays: true
                }
            },
            //? match por date y por contratista
            {
                $match: {
                    //? filtrar por rango de fecha
                    date: {
                        $gte: minDate, //gte: 
                        $lte: maxDate //lte: 
                    },
                    'company.contratista._id': mongoose.Types.ObjectId(EmpresaContratista)
                }
            },
            {
                $project: {
                    uid: '$_id',
                    date: '$date',
                    time: '$time',
                    menu: { // menu
                        uid: '$menu._id',
                        date: '$menu.date',
                        type: '$menu.type',
                    },
                    breakfast: { // breakfast
                        uid: '$breakfast._id',
                        dish: '$breakfast.dish',
                    },
                    lunch: { // lunch
                        uid: '$lunch._id',
                        dish: '$lunch.dish',
                    },
                    afternoonSnack: { // afternoonSnack
                        uid: '$afternoonSnack._id',
                        dish: '$afternoonSnack.dish',
                    },
                    dinner: { // dinner
                        uid: '$dinner._id',
                        dish: '$dinner.dish',
                    },
                    usuario: { // user
                        uid: '$user._id',
                        userName: '$user.userName',
                        document: '$user.document',
                        firstName: '$user.firstName',
                        lastName: '$user.lastName',
                        email: '$user.email',
                        typeDocument: '$user.typeDocument',
                        cuil: '$user.cuil',
                        image: '$user.image',
                        empresa: {
                            uid: '$company._id',
                            name: '$company.name',
                            description: '$company.description',
                            city: '$company.city',
                            direction: '$company.direction',
                            cuit: '$company.cuit',
                            contratista: {
                                uid: '$company.contratista._id',
                                name: '$company.contratista.name',
                                description: '$company.contratista.description',
                                city: '$company.contratista.city',
                                direction: '$company.contratista.direction',
                                cuit: '$company.contratista.cuit',
                            }
                        },
                        user_type: {
                            uid: '$user.user_type._id',
                            name: '$user.user_type.name',
                        }
                    }
                        
                },
            }
        ]); 
        return registrosDiarios;
    } catch (error) {
        console.log(error);
        return null;
    }
}

module.exports = { getRegistrosForNotifications, getRegistrosByCompanyAndDateNoAdmin ,getRegistrosByDateNoAdmin, getAllRegistroDiarioNoAdmin, getRegistrosByDate, createRegistroDiario, getAllRegistrosDiarios, getRegistrosByCompanyAndDate, getAllRegistrosDiariosToday };