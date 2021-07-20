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
    original_unit_price: Number,
    unit_price: Number,
    inventory: Number,
    users_ratings: [{
        userId: String,
        rating: {
            type: Number,
            max: 5,
            min: 0
        },
        comment: String
    }],
    average_rating: {
        type: Number,
        default: 0
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
    discount: {
        // value: {
        default: 0,
        max: 99,
        min: 0,
        type: Number,
        // },
        /*expire: {
            type: Number,
           default: 0
        }*/
    }
})
productSchema.pre('save', function() {
    if (!(this.discount == 0)) {
        this.unit_price = (this.original_unit_price * (100 - this.discount)) / 100;
    } else {
        this.unit_price = this.original_unit_price;
    }
});

var sum_rating = 0;
productSchema.pre('save', function() {
    sum_rating = this.users_ratings.reduce((a, b) => { return a + b.rating }, 0);
    this.average_rating = sum_rating * 1.0 / this.users_ratings.length;
});

const ProductModel = mongoose.model('ProductModel', productSchema);
module.exports.ProductModel = ProductModel;
module.exports.productSchema = productSchema;