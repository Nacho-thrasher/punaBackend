const Menu = require('../models/Menu');
const UserMenu = require('../models/UserMenu');
const User = require('../models/User');
const { postBreakfast, postLunch, postDinner, postSnack, getMenuById, putMenu, postMenu } = require('../services/menu.services');
const Breakfast = require('../models/Breakfast');
const AfternoonSnack = require('../models/AfternoonSnack');
const Dinner = require('../models/Dinner');
const Lunch = require('../models/Lunch');

const createMenu = async (req, res) => {
    //@ input date en front 
    const { breakfastId, lunchId, dinnerId, afternoonSnackId, type, quantity = 0 } = req.body
    try {
        
        const menu = await postMenu(breakfastId, lunchId, dinnerId, afternoonSnackId, type, quantity);
        return res.status(200).json({
            ok: true,
            message: 'Menu creado correctamente.',
            menu
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: `error: ${error}`,
        })
    }
}
const updateMenu = async (req, res) => {
    const { id } = req.params;
    const { breakfastId, lunchId, dinnerId, afternoonSnackId, type, quantity } = req.body;
    try {
        const updateMenu = await putMenu(id, breakfastId, lunchId, dinnerId, afternoonSnackId, type, quantity);
        return res.status(200).json({
            ok: true,
            message: 'Menu actualizado correctamente.',
            updateMenu
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: `error: ${error}`,
        })
    }
}
const getMenu = async (req, res) => {
    const { id } = req.params;
    try {
        //* 1 se encontro menu
        const menu = await Menu.findById(id);
        if (!menu) {
            return res.status(404).json({
                message: 'Menu no encontrado o no existe.'
            });
        }
        //* 2 Treaer UserMenu
        const userMenus = await UserMenu.find({ menu: id });
        //* 3 Crear array de usuarios
        const users = userMenus.map(userMenu => userMenu.user);
        //* 4 Buscar usuarios
        const usersFound = await User.find({ _id: { $in: users } })
        .populate('user_type', 'name')
        //* 5 armar objeto
        usersFound.forEach(user => {
            return user.quantity = userMenus.find((userMenu)=> (userMenu.user).toString() == (user._id).toString()).quantity;
        })
        const args = {
            dish: menu.dish,
            date: menu.date,
            description: menu.description,
            type: menu.type,
            uid: menu._id,
            users: usersFound.map(user => {
                return {
                    uid: user._id,
                    name: user.userName,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    image: user.image,
                    typeDocument: user.typeDocument,
                    document: user.document,
                    cuil: user.cuil,
                    user_type: user.user_type.name,
                    quantity: user.quantity
                }
            })
        }
        return res.status(200).json({
            ok: true,
            args,
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: `error: ${error}`,
        })
    }

}
const getMenues = async (req, res) => {

    try {
        const menus = await Menu.find()
        .populate('breakfast', 'dish')
        .populate('lunch', 'dish')
        .populate('dinner', 'dish')
        .populate('afternoonSnack', 'dish')
        
        return res.status(200).json({
            ok: true,
            menus,
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: `error: ${error}`,
        })
    }

}
const deleteMenu = async (req, res) => {}

const getBreakfast = async (req, res) => {
    try {
        const breakfast = await Breakfast.find();
        return res.status(200).json({
            ok: true,
            breakfast,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: `error: ${error}`,
        });
    }
}
const getLunch = async (req, res) => {
    try {
        const lunch = await Lunch.find();
        return res.status(200).json({
            ok: true,
            lunch,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: `error: ${error}`,
        });
    }
}
const getDinner = async (req, res) => {
    try {
        const dinner = await Dinner.find();
        return res.status(200).json({
            ok: true,
            dinner,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: `error: ${error}`,
        });
    }
}
const getAfternoonSnack = async (req, res) => {
    try {
        const afternoonSnack = await AfternoonSnack.find();
        return res.status(200).json({
            ok: true,
            afternoonSnack,
        })  
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: `error: ${error}`,
        });
    }
}

const createDish = async (req, res) => {
    const { type, dish } = req.body;
    try {
        console.log(req.body);
        if (type == 'breakfast') {
            const breakfast = await Breakfast.create({ dish });
            return res.status(200).json({
                ok: true,
                breakfast
            })
        }
        if (type == 'lunch') {
            const lunch = await Lunch.create({ dish });
            return res.status(200).json({
                ok: true,
                lunch
            })
        }
        if (type == 'dinner') {
            const dinner = await Dinner.create({ dish });
            return res.status(200).json({
                ok: true,
                dinner
            })
        }    
        if (type == 'afternoonSnack') {
            const afternoonSnack = await AfternoonSnack.create({ dish });
            return res.status(200).json({
                ok: true,
                afternoonSnack
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: `error: ${error}`,
        });
    }
}

module.exports = { createDish, createMenu, getMenu, getMenues, updateMenu, deleteMenu, getBreakfast, getLunch, getAfternoonSnack, getDinner }