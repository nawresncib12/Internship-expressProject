const CommandModel = require('../model/CommandModel');
const { ProductModel } = require('../model/ProductModel');
var PromoModel = require('../model/PromoModel');
exports.addCode = async(req, res) => {
    // check body
    if ((!req.body.code) || (!req.body.value)) {
        return res.status(400).send({ message: "code and value can not be emtpy!" });
    }
    var promoCode = new PromoModel({
        code: req.body.code,
        value: req.body.value,
    });
    for (var key in req.body) {
        if (["products", "categories", "maxValue", "limit"].includes(key)) {
            promoCode[key] = req.body[key];
        }
    }
    // save promocode in the database
    try {
        await promoCode.save();
        res.send(promoCode);
    } catch (err) {
        res.status(500).send({
            message: err.message || "creation error"
        });
    }


}
exports.removeCode = async(req, res) => {

    console.log(req.body)
    if (!req.body.promoCodeId) {
        return res.status(500).send("no promoCode selected");
    }
    console.log(req.body.promoCodeId)
    const promoCodeId = req.body.promoCodeId;
    try {
        const deleted = await PromoModel.findOneAndDelete({ _id: promoCodeId });
        if (deleted) {
            res.send(`${promoCodeId} deleted`);
        } else {
            res.status(500).send(`no such promo code`);
        }
    } catch (err) {
        res.status(500).send({
            message: err.message || "deletion error"
        });
    }


}

async function isAvailable(command, code) {

    try {
        const promoCode = await PromoModel.findOne({ code: code });
        if (promoCode) {
            if (promoCode.limit != 0) {
                promoCodeProducts = promoCode.products;
                if (promoCode.categories.length != 0) {
                    for (category of promoCode.categories) {
                        categoryProducts = await ProductModel.find({ category: category });
                        if (categoryProducts) {
                            categoryProducts.forEach(categoryProduct => {
                                promoCodeProducts.push(categoryProduct._id);
                            });
                        }
                    }

                }
                products = [];
                command.products.forEach(commandProduct => {
                    promoCodeProducts.forEach(promoCodeProduct => {
                        if (commandProduct.productId == promoCodeProduct) {
                            products.push(commandProduct);
                        }
                    });
                });
                if (products.length == 0) {
                    return promoCode;
                } else {
                    return { products, promoCode };
                }

            }
            return false;
        }
        return false;
    } catch (err) {
        return false;
    }
}
exports.isAvailable = isAvailable;