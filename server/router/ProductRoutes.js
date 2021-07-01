const express = require('express');
const productRoute = express.Router()
const ProductController = require('../controller/ProductController');

// Add Product
productRoute.post('/api/addProduct', ProductController.createProduct);
//Find Product
productRoute.post('/api/updateProduct/:productId', ProductController.updateProduct);
//Delete Product
productRoute.delete('/api/deleteProduct/:productId', ProductController.deletProduct);
module.exports = productRoute
