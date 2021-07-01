const express = require('express');
const route = express.Router()
const controller = require('../controller/controller');


route.post('/api/users', controller.create);
module.exports = route
