const Visado = require('../models/Visado');

const createVisado = async(empresa, fechaRegistro, fechaVisado, usuario) => {
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
        console.log(visado)
        return visado;
    } catch (error) {
        console.log(error)
        return null
    }
}

module.exports = { createVisado, getVisadoByEmpresaAndFechaRegistro }