
const mongoose = require('mongoose');

var commandSchema = new mongoose.Schema({
    userId: {
        type: String,
    },
    products: {
        type: [String],
        default : []
    },
    total_price: Number,
    status: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const CommandModel = mongoose.model('CommandModel', commandSchema);
exports=CommandModel;