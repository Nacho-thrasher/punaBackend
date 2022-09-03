const { Schema, model } = require('mongoose');

const HorasComidaSchema = Schema({
    // almacenar en esta coleccion los horarios de comida para desayuno, almuerzo, merienda y cena
    horaInicio: {
        type: String,
        require: true
    },
    horaFin: {
        type: String,
        require: true
    },
    tipo: {
        type: String,
        require: true
    },
});
HorasComidaSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
})

module.exports = model('HorasComida', HorasComidaSchema);