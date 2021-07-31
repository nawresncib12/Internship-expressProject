const jwt = require('jsonwebtoken');
const BlacklistedTokensModel = require('../model/BlacklistedTokensModel');
module.exports = async function(req, res, next) {
    const token = req.cookies.x_auth_token;
    if (!token) {
        return res.status(403).send("Access denied . No token provided")
    }
    const blackListed = await BlacklistedTokensModel.findOne({ token: tokrn });
    if (blackListed) {
        return res.status(403).send("Access denied");
    }
    try {
        const decoded = jwt.verify(token, process.env.ETJWTPRIVATEKEY);
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).send('Invalid token.')
    }
}