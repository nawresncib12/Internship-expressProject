const mongoose = require('mongoose');
var promoSchema = new mongoose.Schema({
    code: {
        type: String,
        //max and min length
    },
    value: {
        type: Number,
        min: 0,
        max: 100
    },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProductModel' }],
    categories: [String],
    maxValue: Number,
    limit: Number
})

const PromoModel = mongoose.model('PromoModel', promoSchema);
module.exports = PromoModel;