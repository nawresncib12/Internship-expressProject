
const mongoose = require('mongoose');

var command = new mongoose.Schema({
    username: {
        type: String,
    },
    products: {
        type: [Number],
        default : []
    },
    total_price: Number,
    status: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const commandmd = mongoose.model('command', command);
exports=commandmd;