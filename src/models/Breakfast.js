const { Schema, model } = require('mongoose');

const BreakfastSchema = Schema({
    dish: {
        type: String,
        require: true
    }
})
//? schema methods for user model
BreakfastSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
})
module.exports = model('Breakfast', BreakfastSchema);