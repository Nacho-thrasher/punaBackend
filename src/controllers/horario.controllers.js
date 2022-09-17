const horarioService = require('../services/horario.services');
// breakfast -> desayuno
// lunches -> almuerzo
// afternoonSnacks -> hora de comida de la tarde
// dinner -> cena
const createHoraComida = async (req, res) => {
    const { horaInicio, horaFin, tipo } = req.body;
    try {
        if (!horaInicio || !horaFin || !tipo) {
            return res.status(400).json({
                ok: false,
                msg: 'Faltan datos'
            });
        }
        const newHoraComida = await horarioService.createHoraComida(horaInicio, horaFin, tipo);

        return res.status(200).json({
            ok: false,
            data: newHoraComida,
            msg: 'Hora de comida creada correctamente'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: `error: ${error}`,
        });
    }
}
const getHorasComidas = async (req, res) => {
    try {
        const horasComidas = await horarioService.getHorasComidas();
        return res.status(200).json({
            ok: true,
            data: horasComidas,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: `error: ${error}`,
        })
    }
}
const putHoraComida = async (req, res) => {
    const id = req.params.id;
    const { horaInicio, horaFin } = req.body
    try {
        const horaComida = await horarioService.putHoraComida(id, horaInicio, horaFin);
        return res.status(200).json({
            ok: true,
            data: horaComida
        })
        
    } catch (error) {
        console.log(error);
    }
}
const getHoraComida = async (req, res) => {}
const deleteHoraComida = async (req, res) => {}
const getHoraComidaActual = async (req, res) => {
    try {
        // verficar en que horario de comida estamos 
        // console.log(new Date().toLocaleTimeString());
        const horaComidaActual = await horarioService.getHoraComidaActual();
        return res.status(200).json({
            ok: true,
            data: horaComidaActual
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: `error: ${error}`,
        })
    }
}

module.exports = { getHoraComidaActual, createHoraComida, getHorasComidas, putHoraComida, getHoraComida, deleteHoraComida };