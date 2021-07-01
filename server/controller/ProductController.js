
var ProductModel = require('../model/ProductModel');

// create and save new product
exports.create = (req, res) => {
    // check body
    if (!req.body) {
        res.status(400).send({ message: "Content can not be emtpy!" });
        return;
    }
    const product = new ProductModel({
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        unit_price: req.body.unit_price,
        inventory: req.body.inventory

    })

    // save product in the database
    product
        .save(product)
        .then(result => res.send(result))
        .catch(err => {
            res.status(500).send({
                message: err.message || "creation error"
            });
        });

}
