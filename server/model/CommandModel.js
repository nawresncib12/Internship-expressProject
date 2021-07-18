const { ProductModel, productSchema } = require('./ProductModel');

const mongoose = require('mongoose');

var commandSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel"
    },
    products: [{ productId: String, quantity: Number }],
    total_price: Number,
    status: String,
    delivery_adress: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
})
var product;
commandSchema.pre('save', function() {

    this.total_price = this.products.reduce((a, b) => {
        product = ProductModel.findById(b.productId);
        return a + (b.quantity * product.unit_price)
    }, 0)
});
const CommandModel = mongoose.model('CommandModel', commandSchema);
module.exports = CommandModel;