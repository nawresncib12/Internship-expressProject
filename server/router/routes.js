const express = require('express');
const route = express.Router()
const UserController = require('../controller/UserController');


route.post('/api/users', UserController.create);
module.exports = route
