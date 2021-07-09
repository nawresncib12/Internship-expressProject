const jwt = require('jsonwebtoken');
const config = require('config');
module.exports = function (req, res, next) {
    if (!(req.user.role == "admin")) {
        res.status(403).send('Access Denied')
        next();
    }

}
