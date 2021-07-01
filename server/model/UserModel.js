const mongoose = require('mongoose');

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
    commands :{
        type: [String],
        default : []
    }
})
const UserModel = mongoose.model('UserModel', userSchema);
module.exports=UserModel;