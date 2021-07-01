
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
    }
})
const Usermd = mongoose.model('user', user);
exports.Usermd=Usermd;

var product = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    category: String,
    unit: String,
    price: Number,
    inventory: Number,
    users_ratings: [{
        username: String,
        rating: Number
    }],
    average_rating: Number

})
const productmd = mongoose.model('product', product);
exports.productmd=productmd;

var command = new mongoose.Schema({
    username: {
        type: String,
    },
    products: [Number],
    total_price: Number,
    status: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const commandmd = mongoose.model('command', command);
exports.commandmd=commandmd;