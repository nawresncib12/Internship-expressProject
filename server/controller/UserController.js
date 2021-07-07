
var { UserModel } = require('../model/UserModel');
const _ = require('lodash');
const bcrypt = require('bcrypt');

// create and save new user
exports.addUser = async (req, res) => {
    // check body
    if (!req.body) {
        res.status(400).send({ message: "Content can not be emtpy!" });
        return;
    }
    const user = new UserModel(
        _.pick(req.body, ['username', 'role', 'password'])
    );
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);


    // save user in the database
    try {
        await user.save();
        const token = user.generetaAuthToken();
        res.header('x-auth-token', token).send(
            _.pick(user, ['_id', 'username', 'role'])
        )
    }
    catch (err) {
        res.status(500).send({
            message: err.message || "creation error"
        });
    }


}
//Find user
exports.findUser = (req, res) => {
    UserModel.findOne({ username: req.body.username },
        { explicit: true })
        .select("_id username password role")
        .then(async function (user) {
            if (user === null) {
                res.status(400).send("Invalid email or password");
                return;
            }
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if (!validPassword) {
                res.status(400).send("Invalid email or password");
                return;
            }
            const token = user.generetaAuthToken();
            res.send(token);

        })
        .catch(function (err) {
            res.send({ error: err.message })
        })
}
exports.currentUser = async (req, res) => {
    const user = await UserModel.findById(req.user._id)
        .select("-password");
    res.send(user);
}