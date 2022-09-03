const { Schema, model } = require('mongoose');

const LunchSchema = Schema({
    dish: {
        type: String,
        require: true
    }
})
//? schema methods for user model
LunchSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
})
module.exports = model('Lunch', LunchSchema);