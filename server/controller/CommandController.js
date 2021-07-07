const { ProductModel } = require('../model/ProductModel');
const { UserModel } = require('../model/UserModel');
const CommandModel = require('../model/CommandModel');
exports.addProduct = async (req, res) => {
    if (!req.body.productId) {
        res.status(400).send({ message: "product can not be emtpy!" });
        return;
    }
    const userId = req.user._id;
    const productId = req.body.productId;
    var quantity = 1;
    try {
        const user = await UserModel.findById(userId);
        if (user) {
            const product = await ProductModel.findById(productId);
            if (product) {
                var command = await CommandModel.findOne({ userId: req.body.userId, status: "Loading" });
                if (!command) {
                    command = new CommandModel({
                        userId: req.body.userId,
                        status: "Loading"
                    })
                }
                command.save();
                const updated = await CommandModel.updateOne({ userId: req.body.userId, status: "Loading", "products.product._id": req.body.productId },
                    { $inc: { "products.$.quantity": 1 } }, {
                    returnOriginal: false
                });
                command = await CommandModel.findOne({ userId: req.body.userId, status: "Loading" });
                if (!(updated.nModified)) {
                    command.products.push({ product, quantity });
                    command.save();
                }

                res.status(200).send({ command })
            } else {
                res.status(500).send({ message: "Error finding product" })
            }
        }
        else {
            res.status(500).send({ message: "Error finding user" })
        }
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}
exports.removeProduct = async (req, res) => {
    if (!req.body.productId) {
        res.status(400).send({ message: "user and product can not be emtpy!" });
        return;
    }
    const userId = req.user._id;
    const productId = req.body.productId;
    try {
        const user = await UserModel.findById(userId);
        if (user) {
            const product = await ProductModel.findById(productId);
            if (product) {
                var command = await CommandModel.findOne({ userId: req.body.userId, status: "Loading" });
                if (!command) {
                    res.status(500).send({ message: "Error finding command" })
                }
                //check if product already exits in product
                const updated = await CommandModel.updateOne({ userId: req.body.userId, status: "Loading", "products.product._id": req.body.productId },
                    { $inc: { "products.$.quantity": -1 } }, {
                    returnOriginal: false
                });
                const deleted = await CommandModel.updateOne({ userId: req.body.userId, status: "Loading" },
                    { $pull: { products: { quantity: 0 } } })
                command = await CommandModel.findOne({ userId: req.body.userId, status: "Loading" });
                if (deleted.nModified) {
                    if (command.products.length == 0) {
                        await CommandModel.deleteOne({ userId: req.body.userId, status: "Loading" });
                        return res.send({ message: "Your cart is empty" })
                    }
                }
                res.status(200).send({ command })
            } else {
                res.status(500).send({ message: "Error finding product" })
            }
        }
        else {
            res.status(500).send({ message: "Error finding user" })
        }
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}
exports.emptyCart = async (req, res) => {
    const userId = req.user._id;
    try {
        const user = await UserModel.findById(userId);
        if (user) {
            var command = await CommandModel.findOne({ userId: req.body.userId, status: "Loading" });
            if (!command) {
                return res.status(500).send({ message: "Cart alreaady empty" })
            }
            //check if product already exits in product
            await CommandModel.deleteOne({ userId: req.body.userId, status: "Loading" });
            return res.send({ message: "Your cart is empty" })

        }
        else {
            res.status(500).send({ message: "Error finding user" })
        }
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}
exports.getCart = async (req, res) => {
    const userId = req.user._id;
    try {
        const user = await UserModel.findById(userId);
        if (user) {
            var command = await CommandModel.findOne({ userId: req.body.userId, status: "Loading" });
            if (!command) {
                return res.status(500).send({ message: "Cart is empty" })
            } else {
                return res.send(command)
            }

        }
        else {
            res.status(500).send({ message: "Error finding user" })
        }
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}
exports.submitCommand = async (req, res) => {
    const userId = req.user._id;
    try {
        const user = await UserModel.findById(userId);
        if (user) {
            var command = await CommandModel.findOne({ userId: req.body.userId, status: "Loading" });
            if (!command) {
                return res.status(500).send({ message: "Cart is empty" })
            } else {
                const updated = await CommandModel.updateOne({ userId: req.body.userId, status: "Loading" },
                    { status: "Submitted" }, { returnOriginal: false });
                return res.send("Command submitted successfully")
            }

        }
        else {
            res.status(500).send({ message: "Error finding user" })
        }
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}
exports.getCommands = async (req, res) => {
    const userId = req.user._id;
    try {
        const user = await UserModel.findById(userId);
        if (user) {
            var commands = await CommandModel.find({ userId: req.body.userId, status: { $ne: "Loading" } });
            if (commands.length==0) {
                return res.status(500).send({ message: "No commands to show" })
            } else {
                return res.send(commands)
            }

        }
        else {
            res.status(500).send({ message: "Error finding user" })
        }
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}
exports.confirmCommand = async (req, res) => {
    if (!req.body.commandId) {
        res.status(400).send({ message: "user and product can not be emtpy!" });
        return;
    }
    const commandId = req.body.commandId;
    try {
        var command = await CommandModel.findById(commandId);
        if (!command) {
            return res.status(500).send({ message: "Command not found" })
        } else {
            const updated = await CommandModel.updateOne({ _id: req.body.commandId },
                { status: "Confirmed" }, { returnOriginal: false });
            return res.send("Command is now confirmed")
        }
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}