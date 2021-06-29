
const mongoose = require('mongoose');

var user = new mongoose.Schema({
    username : {
        type : String,
        required: true,
        unique: true
    },
    role : String,
    password : {
        type : String,
        required: true,
    },
    createdAt : {
        type : Date,
        default: Date.now
    }
})

const Usermd = mongoose.model('usermd', user);
