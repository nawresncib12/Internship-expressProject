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
    phone_number: {
        type: Number,
        length: 8
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    discount_code: String,
    final_price: {
        type: Number,
        default: 0
    }
})
var product;
commandSchema.pre('save', async function() {
    try {
        total = await this.products.reduce(async(a, b) => {
            product = await ProductModel.findById(b.productId);
            return a + (b.quantity * product.unit_price);
        }, 0);
        this.total_price = total;
    } catch (err) {
        console.log(err);
    }
});
const CommandModel = mongoose.model('CommandModel', commandSchema);
module.exports = CommandModel;