const mongoose = require('mongoose');

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
exports=productmd;