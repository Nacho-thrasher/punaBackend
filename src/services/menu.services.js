const Breakfast = require('../models/Breakfast');
const Lunch = require('../models/Lunch');
const Dinner = require('../models/Dinner');
const AfternoonSnack = require('../models/AfternoonSnack');
const Menu = require('../models/Menu');

const postBreakfast = async(dish) => {
    try {
        const breakfast = new Breakfast({ dish });
        const newBreakfast = await breakfast.save();
        return newBreakfast;
    } catch (error) {
        console.log(error);
        return null
    }
}
const postLunch = async(dish) => {
    try {
        const lunch = new Lunch({ dish });
        const newLunch = await lunch.save();
        return newLunch;
    } catch (error) {
        console.log(error);
        return null
    }
}
const postDinner = async(dish) => {
    try {
        const dinner = new Dinner({ dish });
        const newDinner = await dinner.save();
        return newDinner;
    } catch (error) {
        console.log(error);
        return null
    }
}
const postSnack = async(dish) => {
    try {
        const snack = new AfternoonSnack({ dish });
        const newSnack = await snack.save();
        return newSnack;
    } catch (error) {
        console.log(error);
        return null
    }
}

const getMenuById = async(id) => {
    try {
        const menu = await Menu.findById(id)
        .populate('breakfast')
        .populate('lunch')
        .populate('dinner')
        .populate('afternoonSnack');

        if (!menu) {
            return null;
        }
        // fecha formato: lunes 1 de enero de 2020
        menu.date = new Date(menu.date).toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        return menu;

    } catch (error) {
        console.log(error);
        return null
    }
}

const putMenu = async(menu, breakfastId, lunchId, dinnerId, afternoonSnackId, tipo, quantity) => {
    try {
        console.log(menu, breakfastId, lunchId, dinnerId, afternoonSnackId, tipo, quantity);
        const newMenu = await Menu.findByIdAndUpdate(menu, {
            breakfast: breakfastId,
            lunch: lunchId,
            dinner: dinnerId,
            afternoonSnack: afternoonSnackId,
            type: tipo,
            quantity: quantity
        });
        return newMenu;

    } catch (error) {
        console.log(error);
        return null
    }
}

const postMenu = async(breakfastId, lunchId, dinnerId, afternoonSnackId, type, quantity) => {
    try {
        const fechaHoy = new Date();
        const menu = new Menu({
            breakfast: breakfastId,
            lunch: lunchId,
            dinner: dinnerId,
            afternoonSnack: afternoonSnackId,
            type: type,
            quantity: quantity,
            date: fechaHoy
        });
        const newMenu = await menu.save();
        return newMenu;

    } catch (error) {
        console.log(error);
        return null
    }
}

module.exports = { postMenu, putMenu ,postBreakfast, postLunch, postDinner, postSnack, getMenuById }