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
        // hora actual argentina
        const horaActual = new Date().toLocaleString("es-AR", {timeZone: "America/Argentina/Buenos_Aires", 
            hour: 'numeric', minute: 'numeric'
        });
        
        // devolver hora de comida actual en la que nos encontramos con respecto a la hora local
        console.log("horaactual = ",horaActual);
        //* si la hora actual es 00 o 01 o 02 
        //* entonces la hora de comida actual es la ultima hora de comida del dia anterior

        
        const horaComidaActual = await HorasComida.findOne({
            horaInicio: { $lte: horaActual },
            horaFin: { $gte: horaActual }
        });
        // si no encontramos ninguna hora de comida que coincida con la hora actual
        if (!horaComidaActual) {
            return null;
        }

        return horaComidaActual;

    } catch (error) {
        
    }
}

module.exports = { getHoraComidaActual, createHoraComida, getHorasComidas, putHoraComida, getHoraComida, deleteHoraComida };