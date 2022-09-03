const { Schema, model } = require('mongoose');

const MenuSchema = Schema({
    date: {
        type: String,
        require: true
    },
    type: {
        type: String,
        require: true
    },
    // price: {
    //     type: Number,
    //     require: true
    // }
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
    quantity: {
        type: Number,
    }
});
//? schema methods for user model
MenuSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
})

module.exports = model('Menu', MenuSchema);