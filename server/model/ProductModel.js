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
    users_ratings: [{ user: String, rating: Number }], 
    average_rating: Number,
    is_deleted: {
        type: Boolean,
        default: false
    },
})
var sum_rating = 0;
productSchema.pre('save', function () {
    sum_rating = this.users_ratings.reduce((a, b) => { return a + b.rating }, 0);
    this.average_rating = sum_rating * 1.0 / this.users_ratings.length;
});
const ProductModel = mongoose.model('ProductModel', productSchema);
module.exports.ProductModel = ProductModel;
module.exports.productSchema = productSchema;