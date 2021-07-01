
var ProductModel = require('../model/ProductModel');

// create and save new product
exports.createProduct = (req, res) => {
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

// Update a product 

exports.updateProduct = (req, res)=>{
    if(!req.body){
        return res
            .status(400)
            .send({ message : "Data to update can not be empty"})
    }

    const productId = req.params.productId;
    ProductModel.findByIdAndUpdate(productId, req.body,{ new: true })
        .then(data => {
            if(!data){
                console.log(productId);
                res.status(404).send({ message : `Cannot Update product`})
            }else{
                res.send(data)
            }
        })
        .catch(err =>{
            res.status(500).send({ message : "Error Updating product information"})
        })
}

// Delete a product

exports.deletProduct = (req, res)=>{
    const productId = req.params.productId;
    ProductModel.findByIdAndUpdate(productId,{is_deleted:true},{ new: true })
        .then(data => {
            if(!data){
                console.log(productId);
                res.status(404).send({ message : `Cannot Delete product`})
            }else{
                res.send(`The product is deleted \n ${data}`)
            }
        })
        .catch(err =>{
            res.status(500).send({ message : "Error Deleting product"})
        })
}