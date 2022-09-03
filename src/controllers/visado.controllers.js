const VisadoService = require('../services/visado.services')

const createVisado = async (req, res) => {
    const { empresa, fechaRegistro, usuario } = req.body
    try {
        // fecha formato dd/mm/yyyy
        const fechaVisado = new Date() 
        // day 2 digit
        const day = fechaVisado.getDate().toString().padStart(2, '0')
        const month = (fechaVisado.getMonth() + 1).toString().padStart(2, '0')
        const year = fechaVisado.getFullYear()
        const fechaVisadoString = `${day}/${month}/${year}`
        const visado = await VisadoService.createVisado(empresa, fechaRegistro, fechaVisadoString, usuario)
        
        return res.status(201).json({
            ok: true,
            visado
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}
const getVisado = async (req, res) => {}
const getVisados = async (req, res) => {}
const updateVisado = async (req, res) => {}

module.exports = { createVisado, getVisado, getVisados, updateVisado }