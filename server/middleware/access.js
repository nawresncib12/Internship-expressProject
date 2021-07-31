const jwt = require('jsonwebtoken');
const BlacklistedTokensModel = require('../model/BlacklistedTokensModel');
const { UserModel } = require('../model/UserModel');
module.exports = async function(req, res, next) {
    const token = req.cookies.access_token;;
    if (!token) {
        return res.status(403).send("Access denied");
    }
    try {
        const blackListed = await BlacklistedTokensModel.findOne({ token: token });
        if (blackListed) {
            return res.status(403).send("Access denied");
        }
        const decoded = jwt.verify(token, process.env.ETJWTPRIVATEKEY);
        user = await UserModel.findById(decoded._id).select("-password");
        req.user = user;
        const blackList = new BlacklistedTokensModel({
            token: token
        });
        await blackList.save();
        next();
    } catch (ex) {
        res.status(400).send(ex.message)
    }
}