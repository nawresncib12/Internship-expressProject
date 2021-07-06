const express = require('express');
const route = express.Router()
const UserController = require('../controller/UserController');
const ProductController = require('../controller/ProductController');

//Add User
route.post('/api/subscribe', UserController.addUser);
//Find user
route.post('/api/login', UserController.findUser);
// Add Product
route.post('/api/addProduct', ProductController.createProduct);
//Find Product
route.post('/api/updateProduct/:productId', ProductController.updateProduct);
//Delete Product
route.delete('/api/deleteProduct/:productId', ProductController.deletProduct);
//listProducts
route.post('/api/products', ProductController.listProducts);
module.exports = route
