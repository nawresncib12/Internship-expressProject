const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
var userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    role: String,
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProductModel' }]
})
userSchema.methods.generetaAuthToken = function() {
    const token = jwt.sign({ _id: this._id, role: this.role }, process.env.ETJWTPRIVATEKEY);
    return token;
}
const UserModel = mongoose.model('UserModel', userSchema);
module.exports.UserModel = UserModel;
module.exports.userSchema = userSchema;