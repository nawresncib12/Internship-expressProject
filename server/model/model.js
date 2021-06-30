
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
const Usermd = mongoose.model('usermd', user);
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
    average_rating: Numbers

})
const productmd = mongoose.model('productmd', product);
exports.productmd=productmd;

var command = new mongoose.Schema({
    username: {
        type: String,
    },
    products: [productId],
    total_price: Number,
    status: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const commandmd = mongoose.model('commandmd', command);
exports.commandmd=commandmd;