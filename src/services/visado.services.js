const Visado = require('../models/Visado');

const createVisado = async(
    empresa, 
    fechaRegistro, 
    fechaVisado, 
    usuario
) => {
    try {
        const visado = new Visado({ empresa, fechaRegistro, fechaVisado, usuario });
        await visado.save();
        return visado;
        
    } catch (error) {
        console.log(error)
        return null
    }
}

const getVisadoByEmpresaAndFechaRegistro = async(empresa, fechaRegistro) => {
    try {
        const visado = await Visado.findOne({ empresa, fechaRegistro })
        .populate('empresa')
        .populate('usuario')
        return visado;
    } catch (error) {
        console.log(error)
        return null
    }
}

const getVisadoByEmpresaAndDate = async(empresa, date) => {
    try {
        const visado = await Visado.find({ empresa, fechaRegistro: date })
        return visado;        

    } catch (error) {
        console.log(error)
        return false
    }
}

module.exports = { createVisado, getVisadoByEmpresaAndFechaRegistro, getVisadoByEmpresaAndDate }