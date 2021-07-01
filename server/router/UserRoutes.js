const express = require('express');
const userRoute = express.Router()
const UserController = require('../controller/UserController');

// Add User
userRoute.post('/api/subscribe', UserController.addUser);
//Find user
userRoute.post('/api/login', UserController.findUser);
module.exports = userRoute
