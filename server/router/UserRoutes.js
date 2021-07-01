const express = require('express');
const route = express.Router()
const UserController = require('../controller/UserController');

// Add User
route.post('/api/users', UserController.create);
//Find user
route.post('/api/login', UserController.findUser);
module.exports = route
