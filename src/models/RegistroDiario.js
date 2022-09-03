const {
    Schema,
    model
} = require('mongoose');

const RegistroDiarioSchema = Schema({
    date: {
        type: String,
        require: true
    },
    time: {
        type: String,
        require: true
    },
    type: { // id del menu
        type: Schema.Types.ObjectId,
        ref: 'Menu'
    },
    breakfast: {
        type: Schema.Types.ObjectId,
        ref: 'Breakfast'
    },
    lunch: {
        type: Schema.Types.ObjectId,
        ref: 'Lunch'
    },
    afternoonSnack: {
        type: Schema.Types.ObjectId,
        ref: 'AfternoonSnack'
    },
    dinner: {
        type: Schema.Types.ObjectId,
        ref: 'Dinner'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
        require: true
    }
});
//? schema methods for user model
RegistroDiarioSchema.method('toJSON', function () {
    const {
        __v,
        _id,
        ...object
    } = this.toObject();
    object.uid = _id;
    return object;
})

module.exports = model('RegistroDiario', RegistroDiarioSchema);