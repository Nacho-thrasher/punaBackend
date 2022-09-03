const { Schema, model } = require('mongoose');

const UserSchema = Schema({
    userName: {
        type: String,
        require: true
    },
    firstName: {
        type: String,
        require: true
    },
    lastName: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: false
    },
    password: {
        type: String,
        require: true
    },
    image: {
        type: String
    },
    typeDocument: {
        type: String,
    },
    document: {
        type: String,
    },
    cuil: {
        type: String,
    },
    user_type: {
        type: Schema.Types.ObjectId,
        ref: 'User_type'  
    }
});
//? schema methods for user model
UserSchema.method('toJSON', function () {
    const { __v, _id, password, ...object } = this.toObject();
    object.uid = _id;
    return object;
})

module.exports = model('User', UserSchema);