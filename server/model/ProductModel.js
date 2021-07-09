const mongoose = require('mongoose');
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
    users_ratings: [{ userId: String, rating: Number }],
    average_rating: {
        type: Number,
        default: 0
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
})
var sum_rating = 0;
productSchema.pre('save', function () {
    console.log('hi');
    sum_rating = this.users_ratings.reduce((a, b) => { return a + b.rating }, 0);
    this.average_rating = sum_rating * 1.0 / this.users_ratings.length;
});
const ProductModel = mongoose.model('ProductModel', productSchema);
module.exports.ProductModel = ProductModel;
module.exports.productSchema = productSchema;