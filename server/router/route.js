const express = require('express');
const route = express.Router()
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const UserController = require('../controller/UserController');
const ProductController = require('../controller/ProductController');
const CommandController = require('../controller/CommandController');
//Add User
route.post('/api/subscribe', UserController.addUser);
//Find user
route.post('/api/login', UserController.findUser);

//Current user
route.get('/api/me', auth, UserController.currentUser);

// Add Product
route.post('/api/addProduct', [auth, admin], ProductController.createProduct);
//Update Product
route.post('/api/updateProduct/:productId', [auth, admin], ProductController.updateProduct);
//Delete Product
route.delete('/api/deleteProduct/:productId', [auth, admin], ProductController.deletProduct);
//listProducts
route.post('/api/products', auth, ProductController.listProducts);
//rateProduct
route.post('/api/rateProduct/:productId', auth, ProductController.rateProduct);

//addProduct
route.post('/api/commands/addProduct', auth, CommandController.addProduct);

//removeProduct
route.post('/api/commands/removeProduct', auth, CommandController.removeProduct);

//emptyCart
route.post('/api/commands/emptyCart', auth, CommandController.emptyCart);

//getCart
route.post('/api/commands/getCart', auth, CommandController.getCart);

//submitCommand
route.post('/api/commands/submitCommand', auth, CommandController.submitCommand);

//getCommands
route.post('/api/commands/getCommands', auth, CommandController.getCommands);

//confirmCommand 
route.post('/api/commands/confirmCommand', [auth, admin], CommandController.confirmCommand);

//getAllCommands 
route.post('/api/commands/getAllCommands', [auth, admin], CommandController.getAllCommands);

//add Discount 
route.post('/api/addDiscount', [auth, admin], ProductController.addDiscount);

//remove Discount 
route.post('/api/addDiscount', [auth, admin], ProductController.removeDiscount);
module.exports = route