const { Schema, model } = require('mongoose');

const ExtraSchema = Schema({
    empresa: {
        type: String,
        require: true
    },
    fecha: {
        type: String,
        require: true
    },
    cantServ: {
        type: Number,
        require: true
    },
    usuario: {
        type: String,
        require: true
    },
    detalle: {
        type: String,
        require: true
    },
});

ExtraSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
})
module.exports = model('Extra', ExtraSchema);