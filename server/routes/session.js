const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require('passport');
const jwt = require('jsonwebtoken');

const { pw } = require("../database/database");
const pwDB = new pw();
const initializePassport = require('../passport-config')

router.use(passport.initialize({}));

router.route("/register")
    .post(async function (req, res) {
        /*
        body: username (string), password (string), email (string)
        send 200: redirecting the user to the login page after successful registering
        send 400: username/email already in use
        send 500: if there was an error with the database
         */
        try{
            const hashedPassword = await bcrypt.hashSync(req.body.password, 10)
            pwDB.insert({"username":req.body.username, "password":hashedPassword, "email":req.body.email}).then(() => {
                res.redirect('/login');
            }).catch(err => {
                if (err.alreadyExists) {
                    throw new Error("internal server error");
                }
                res.sendStatus(400)
            }).catch( err => {
                console.log(err);
                res.sendStatus(500);
            })
        }catch {
            res.redirect("/register")
        }
    })
    .get(function (req, res) {
        res.send("HI")
    })

router.post("/login", function (req, res) {
    /*
    body: username (string), password (string)
    send 404: if no user with this username could be found
    send 400: if the password is incorrect
    send 200: if login was successful
    response body:
        success: boolean declaring if the login succeeded
        message: message explaining the error/success
        token: only if login was successful
     */
    pwDB.findOne({"username":req.body.username}).then(resolve => {
        if (resolve === null) {
            res.sendStatus(404).send({
                success: false,
                message: "No user found with this username"
            });
        }

        if (!bcrypt.compareSync(req.body.password, resolve.password)) {
            res.sendStatus(400).send({
                success: false,
                message: "Password is incorrect"
            })
        }

        const payload = {
            username: resolve.username,
            id: resolve._id,
            email: resolve.email
        }
        const token = jwt.sign(payload, "Secret", {expiresIn:"1d"})
        return res.send({
            success: true,
            message: "Logged in successfully",
            token: "Bearer " + token
        })
    })
})
module.exports = router;