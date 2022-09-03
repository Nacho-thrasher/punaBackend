const { Schema, model } = require('mongoose');

const User_type = Schema({
    name: {
        type: String,
    },
    description: {
        type: String,
    }
});
User_type.method('toJSON', function () {
    const { __v, ...object } = this.toObject();
    return object;
});

module.exports = model('User_type', User_type);