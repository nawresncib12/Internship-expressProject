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
exports.listProducts = async(req, res) => {
    var minPrice, maxPrice;
    filters = { is_deleted: false };
    for (var key in req.body) {
        switch (key) {
            case "sort":
                sort = req.body.sort;
                break;
            case "minPrice":
                minPrice = req.body[key];
                break;
            case "maxPrice":
                maxPrice = req.body[key];
                break;
            case "category":
            case "in-stock":
            case "name":
                filters[key] = req.body[key];
                break;
            default:
                res.status(404).send({ message: `unaccepted filter` })
        }

    }

    if (minPrice && maxPrice) {
        filters['unit_price'] = { $gt: minPrice, $lt: maxPrice };
    } else if (minPrice) {
        console.log("heere")
        filters['unit_price'] = { $gt: minPrice };
    } else if (maxPrice) {
        filters['unit_price'] = { $lt: maxPrice };
    }

    switch (sort) {
        case "Latest":
            sort = { createdAt: -1 }
            break;
        case "Cheapest":
            sort = { unit_price: 1 }
            break;
        case "Most expensive":
            sort = { unit_price: -1 }
            break;
        case "Best rated":
            sort = { average_rating: -1 }
            break;
        default:
            sort = { createdAt: -1 }
    }
}

try {
    const products = await ProductModel.find(filters).sort(sort);
    if (!products.length) {
        res.status(404).send({ message: `no products found` })
    } else {
        res.send(`Here is your list \n ${products}`)
    }
} catch (err) {
    return res.status(500).send({ message: err.mesesage })
}
}
//rate Product
exports.rateProduct = async(req, res) => {
    const productId = req.params.productId;
    const userId = req.user._id;
    const rating = req.body.rating;
    const comment = req.body.comment;
    if ((!rating) && (!comment)) {
        return res.status(400).send({ errorMessage: "You must give a rating or a comment" })
    }

    try {
        var product = await ProductModel.findById(productId);
        if (product) {
            const exists = await ProductModel.findOne({ _id: productId, "users_ratings.userId": userId });
            if (exists) {
                if (rating) {
                    await ProductModel.updateOne({ _id: productId, "users_ratings.userId": userId }, { "users_ratings.$.rating": rating }, { returnOriginal: false });
                }
                if (comment) {
                    await ProductModel.updateOne({ _id: productId, "users_ratings.userId": userId }, { "users_ratings.$.comment": comment }, { returnOriginal: false });
                }
                product = await ProductModel.findById(productId);
                product.save();

            } else {
                if (rating && comment) {
                    product.users_ratings.push({ userId, rating, comment });
                } else if (comment) {
                    return res.status(400).send({ errorMessage: "You must give a rating" })
                } else {
                    product.users_ratings.push({ userId, rating });
                }
                product.save();
            }

            res.status(200).send({ successMessage: "Rating submitted successfully" })

        } else {
            res.status(500).send({ errorMessage: "Error finding product" })
        }
    } catch (err) {
        res.status(500).send({ errorMessage: err.mesesage })
    }
}