
const { ProductModel } = require('../model/ProductModel');
const { UserModel } = require('../model/UserModel');

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
        inventory: req.body.inventory,
        users_ratings: []
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

exports.updateProduct = (req, res) => {
    if (!req.body) {
        return res
            .status(400)
            .send({ message: "Data to update can not be empty" })
    }

    const productId = req.params.productId;
    ProductModel.findByIdAndUpdate(productId, req.body, { new: true })
        .then(data => {
            if (!data) {
                res.status(404).send({ message: `Cannot Update product` })
            } else {
                res.send(data)
            }
        })
        .catch(err => {
            res.status(500).send({ mesesage: "Error Updating product information" })
        })
}

// Delete a product

exports.deletProduct = (req, res) => {
    const productId = req.params.productId;
    ProductModel.findByIdAndUpdate(productId, { is_deleted: true }, { new: true })
        .then(data => {
            if (!data) {
                res.status(404).send({ message: `Cannot Delete product` })
            } else {
                res.send(`The product is deleted \n ${data}`)
            }
        })
        .catch(err => {
            res.status(500).send({ message: "Error Deleting product" })
        })
}
//list products 
exports.listProducts = (req, res) => {
    filters = { is_deleted: false };
    for (var key in req.body) {
        if (key == "sort") {
            sort = req.body.sort;
        }
        else {
            filters[key] = req.body[key];
        }
    }
    if (sort) {//switch
        if (sort == "Latest") {
            sort = { createdAt: -1 }
        } else if (sort == "Cheapest") {
            sort = { unit_price: 1 }
        } else if (sort == "Most expensive") {
            sort = { unit_price: -1 }
        } else if (sort == "Best rated") {
            sort = { average_rating: -1 }
        }

    } else {
        sort = { createdAt: 1 }
    }
    ProductModel.find(filters).sort(sort)
        .then(data => {
            if (!data) {
                res.status(404).send({ message: `no products found` })
            } else {
                res.send(`Here is your list \n ${data}`)
            }
        })
        .catch(err => {
            res.status(500).send({ message: err.mesesage })
        })
}
//rate Product

exports.rateProduct = async (req, res) => {
    const productId = req.params.productId;
    const userId=req.user._id;
    console.log(userId);
    try {
        var product = await ProductModel.findById(productId);
        if (product) {
            /* await ProductModel.findOneAndUpdate({ _id: productId, "users_ratings.user": req.user._id }, {
                 $set: { "users_ratings.$.rating": req.body.rating }}
                 , (err, doc) => {
                 console.log(doc);
                 res.status(200).send({ doc })
             });*/
            const updated = await ProductModel.updateOne({ _id: req.params.productId, "users_ratings.userId": userId },
                { "users_ratings.$.rating": req.body.rating }, { returnOriginal: false });
            const rating = req.body.rating;
            console.log(updated)
            if ((!updated.nModified) && (updated.n == 0)) {
                product.users_ratings.push({ userId, rating });
                product.save();
            } else {
                product = await ProductModel.findById(productId);
                product.save();
            }
            res.status(200).send({ product })
            //Problem:showing old even tho cluster is  updated

        } else {
            res.status(500).send({ message: "Error finding product" })
        }
    } catch (err) {
        res.status(500).send({ message: err.mesesage })
    }
}