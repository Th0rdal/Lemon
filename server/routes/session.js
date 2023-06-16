require('dotenv').config();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require('passport');
const jwt = require('jsonwebtoken');

const { pw } = require("../database/database");
const pwDB = new pw();
const {notAuthenticated} = require('../middleware/authentication');

const {sendMail} = require("../middleware/apiCalls")

router.use(passport.initialize({}));

function generateRandomString(length) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}

 router.get("/authenticate/:authenticationKey", function(req, res) {
    const authenticationKey = req.params["authenticationKey"];
    let username = authenticationKey.substring(8, authenticationKey.length-8);
    pwDB.update({"username":username}, {$set:{"verified":true}}, {})
        .then(resolve => {
            if (resolve === 1) {
                res.send("Thank you for verifying your email address. You can now close this tab and enjoy Lemon!");
                return;
            }
            console.log(resolve)
            res.sendStatus(500)
        })
        .catch(error => {
            console.log(error);
            res.sendStatus(500)
        })
 })
router.route("/register")
    .post(async function (req, res) {
        /*
        body: username (string), password (string), email (string)
        send 200: redirecting the authentication to the authentication page after successful registering
        send 400: username/email already in use
        send 500: if there was an error with the database
         */
        try{
            let entriesFound = await pwDB.findOne({"username":req.body.username});
            if (entriesFound !== 0) {
                res.status(401).json({
                    "errorType": "username",
                    "message":"username already exists"});
            }
            entriesFound = await pwDB.findOne({"email":req.body.email});
            if (entriesFound !== 0) {
                res.status(401).json({
                    "errorType": "email",
                    "message":"email already exists"});
            }
            const hashedPassword = await bcrypt.hashSync(req.body.password, 10).toString();
            pwDB.insert({"username":req.body.username, "password":hashedPassword, "email":req.body.email, "verified":false}).then(() => {
                let url = "http://localhost:3000/authenticate/" + generateRandomString(8) + req.body.username + generateRandomString(8)
                sendMail(url, req.body.email)
                    .catch(error => console.log(error))
                res.sendStatus(204)
            }).catch(err => {
                if (!err.alreadyExists) {
                    throw new Error("internal server error");
                }
                res.sendStatus(400);
            }).catch( err => {
                console.log(err);
                res.sendStatus(500);
            })
        }catch (e){
            console.log(e);
            res.redirect("/user/register.html")
        }
    })
    .get(function (req, res) {
        res.send("HI")
    })

router.post("/login", notAuthenticated, function (req, res) {
    /*
    body: username (string), password (string)
    send 404: if no authentication with this username could be found
    send 400: if the password is incorrect
    send 200: if authentication was successful
    response body:
        success: boolean declaring if the authentication succeeded
        message: message explaining the error/success
        token: only if authentication was successful
     */
    pwDB.findOne({"username":req.body.username}).then(resolve => {
        if (resolve === null) {
            res.sendStatus(404).json({
                success: false,
                message: "No authentication found with this username"
            });
            return;
        }

        if (!bcrypt.compareSync(req.body.password, resolve.password)) {
            res.sendStatus(400).json({
                success: false,
                message: "Password is incorrect"
            })
            return;
        }

        const payload = {
            username: resolve.username,
            id: resolve._id,
            email: resolve.email
        }
        const token = jwt.sign(payload, process.env.JWT_KEY, {expiresIn:"1h"})
        res.json({
            success: true,
            message: "Logged in successfully",
            token: "Bearer " + token,
            id: resolve._id
        })
    })
})
module.exports = router;