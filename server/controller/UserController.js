const { UserModel } = require('../model/UserModel');
const BlacklistedTokensModel = require('../model/BlacklistedTokensModel');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const crypto = require("crypto");
// create and save new user
exports.subscribe = async(req, res) => {
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
            return res
                .send(
                    _.pick(user, ['_id', 'username', 'role'])
                )
        } catch (err) {
            res.status(500).send({
                message: err.message || "creation error"
            });
        }


    }
    //Find user
exports.login = async(req, res) => {

    try {
        if (req.cookies.x_auth_token) {
            res.status(404).send("Already logged in");
        }
        user = await UserModel.findOne({ username: req.body.username }, { explicit: true })
            .select("_id username password role");
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
        var code = crypto.randomBytes(6).toString('hex');
        user.set({ authCode: code });
        await user.save();
        var transporter = nodemailer.createTransport(smtpTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            auth: {
                user: 'ncibnawres04@gmail.com',
                pass: 'vangogh1204'
            }
        }));
        var mailOptions = {
            from: 'ncibnawres04@gmail.com',
            to: 'nawresncib@insat.u-carthage.tn',
            subject: 'Sending Email using Node.js[nodemailer]',
            text: code
        };
        transporter.sendMail(mailOptions, function(error) {
            if (error) {
                res.send("Error sending email");
            }
        });
        res.cookie("access_token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + (600000))
        }).send("Email sent");

    } catch (err) {
        res.send({ error: err.message })
    }
}
exports.verifyLogin = async(req, res) => {
    try {
        const code = req.body.code;

        if (user.authCode == code) {
            const token = user.generetaAuthToken();
            return res
                .cookie("x_auth_token", token, {
                    httpOnly: true,
                    //   secure: process.env.NODE_ENV === "production",
                }).cookie(
                    'access_token', 'expired', { httpOnly: true, expires: new Date(Date.now() - 1) }
                )
                .send(
                    "Successfully logged in");
        } else {
            res.send("invalid code");
        }
    } catch (err) {
        res.send({ error: err.message })
    }
}
exports.logout = async(req, res) => {
    try {
        const token = req.cookies.x_auth_token;

        if (!token) {
            return res.status(403).send("Access denied")
        }
        const blackList = new BlacklistedTokensModel({
            token: token
        });
        await blackList.save();
        return res
            .cookie("x_auth_token", token, {
                httpOnly: true,
                expires: new Date(Date.now() - 1)
            })
            .send(
                "Successfully logged out");
    } catch (err) {
        res.send({ error: err.message })
    }


}
exports.currentUser = async(req, res) => {
    const user = await UserModel.findById(req.user._id)
        .select("-password");
    res.send(user);
}