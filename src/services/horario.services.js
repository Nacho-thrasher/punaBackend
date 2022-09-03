const HorasComida = require('../models/HorasComida.model');

const createHoraComida = async (horaInicio, horaFin, tipo) => {
    try {
        const horaComida = new HorasComida({
            horaInicio,
            horaFin,
            tipo
        });
        const newHoraComida = await horaComida.save();
        return newHoraComida;    
    
    } catch (error) {
        console.log(error);
        return null
    }
}
const getHorasComidas = async () => {
    try {
        const horasComidas = await HorasComida.find();
        return horasComidas;           
    } catch (error) {
        console.log(error);
        return null
    }
}
const putHoraComida = async (id, horaInicio, horaFin) => {
    try {
        const horaComida = await HorasComida.findById(id);
        horaComida.horaInicio = horaInicio;
        horaComida.horaFin = horaFin;
        const updatedHoraComida = await horaComida.save();
        return updatedHoraComida;

    } catch (error) {
        console.log(error)
        return null
    }
}
const getHoraComida = async () => {}
const deleteHoraComida = async () => {}
const getHoraComidaActual = async () => {
    try {
        // devolver hora de comida actual en la que nos encontramos con respecto a la hora local
        const horaComidaActual = await HorasComida.findOne({
            horaInicio: {
                // hora local de argentina no de la computadora
                $lte: new Date().toLocaleTimeString()
            },
            horaFin: {
                $gte: new Date().toLocaleTimeString()
            }
        });
        console.log(horaComidaActual);
        return horaComidaActual;

    } catch (error) {
        
    }
}

module.exports = { getHoraComidaActual, createHoraComida, getHorasComidas, putHoraComida, getHoraComida, deleteHoraComida };