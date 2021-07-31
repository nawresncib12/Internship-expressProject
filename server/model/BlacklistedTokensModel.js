const mongoose = require('mongoose');
var BlacklistedTokensSchema = new mongoose.Schema({
    token: String,
    createdAt: {
        default: Date.now(),
        type: Date
    }
})

const BlacklistedTokensModel = mongoose.model('BlacklistedTokensModel', BlacklistedTokensSchema);
module.exports = BlacklistedTokensModel;