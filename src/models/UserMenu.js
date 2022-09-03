const { Schema, model } = require('mongoose');

const UserMenuSchema = Schema({
    
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    menu: {
        type: Schema.Types.ObjectId,
        ref: 'Menu',
        require: true
    },
    quantity: {
        type: Number,
        require: true
    }
    
});
//? schema methods for user model
UserMenuSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
})

module.exports = model('UserMenu', UserMenuSchema);