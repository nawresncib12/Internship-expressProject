const mongoose = require('mongoose');
const { userSchema } = require('./UserModel');
var productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    category: String,
    unit_price: Number,
    inventory: Number,
    users_ratings: [{user:userSchema,rating:Number}],
    average_rating: Number,
    is_deleted: {
        type: Boolean,
        default: false
    },
})
productSchema.pre('save', function () {
    this.average_rating = this.users_ratings.reduce((a, b) => { return a + b.rating }, 0)
//just adding here !!!
});
const ProductModel = mongoose.model('ProductModel', productSchema);
module.exports.ProductModel = ProductModel;
module.exports.productSchema = productSchema;