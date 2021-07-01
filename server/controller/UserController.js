
var UserModel = require('../model/UserModel');

// create and save new user
exports.addUser = (req, res) => {
    // check body
    if (!req.body) {
        res.status(400).send({ message: "Content can not be emtpy!" });
        return;
    }
    const user = new UserModel({
        username: req.body.username,
        role: req.body.role,
        password: req.body.password
    })

    // save user in the database
    user
        .save(user)
        .then(result => res.send(result))
        .catch(err => {
            res.status(500).send({
                message: err.message || "creation error"
            });
        });

}
//Find user
exports.findUser = (req, res) => {
    UserModel.findOne({ username: req.body.username, password: req.body.password },
        { explicit: true }).then(function (user) {
            // do something with user
            if (user===null){
                res.status(400).send("No match found");
                return;
            }
            res.status(200).send(`You are logged in \n ${user}`)}).catch (function(err) {
                res.send({ error: err })
            })
}