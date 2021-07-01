const mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
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
        userId: String,
        rating: Number
    }],
    average_rating: Number

})
productSchema.pre('save', function () {
    this.average_rating = this.users_ratings.reduce((a, b) => { return a + b.rating }, 0)
});
const ProductModel = mongoose.model('ProductModel', productSchema);
exports = ProductModel;