const mongoose = require('mongoose');

var user = new mongoose.Schema({
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
        type: [Number],
        default : []
    }
})
const Usermd = mongoose.model('user', user);
exports=Usermd;