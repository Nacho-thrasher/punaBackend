const { Schema, model } = require('mongoose');

const CompanySchema = Schema({
    name: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    city: {
        type: String,
        require: true
    },
    direction: {
        type: String,
        require: true
    },
    phone: {
        type: String,
        require: true
    },
    cuit: {
        type: String,
    },
    image: {
        type: String
    },
    // empresa puede o no tener un contratista asociado
    contratista: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
        default: null
    },
    
});
//? schema methods for user model
CompanySchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
})

module.exports = model('Company', CompanySchema);