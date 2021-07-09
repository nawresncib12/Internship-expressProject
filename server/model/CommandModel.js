const { productSchema } = require('./ProductModel');

const mongoose = require('mongoose');

var commandSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"UserModel"
    },
    products: [{product:String,quantity:Number}],
    total_price: Number,
    status: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
})
commandSchema.pre('save', function () {
    this.total_price = this.products.reduce((a, b) => { return a + (b.quantity*b.product.unit_price)}, 0)
});
const CommandModel = mongoose.model('CommandModel', commandSchema);
module.exports = CommandModel;