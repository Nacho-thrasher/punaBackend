const { Schema, model } = require('mongoose');

const VisadoSchema = Schema({
    empresa: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
        require: true
    },
    fechaRegistro: {
        type: String,
        require: true
    },
    fechaVisado: {
        type: String,
        require: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
})
//? schema methods for user model
VisadoSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
})
module.exports = model('Visado', VisadoSchema);