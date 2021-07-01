
var model = require('../model/model');

// create and save new user
exports.create = (req,res)=>{
    // check body
    if(!req.body){
        res.status(400).send({ message : "Content can not be emtpy!"});
        return;
    }
    const user = new model.Usermd({
        username : req.body.username,
        role : req.body.role,
        password: req.body.password
    })

    // save user in the database
    user
        .save(user)
        .then(result=>res.send(result))
        .catch(err =>{
            res.status(500).send({
                message : err.message || "creation error"
            });
        });

}