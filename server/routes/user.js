const express = require("express");
const router = express.Router();

const {user} = require("../database/database");
const userDB = new user();
const {pw} = require("../database/database");
const pwDB = new pw();
const {sendResponse} = require('../middleware/formatResponse');
const passport = require("passport");
const path = require('path');
const bcrypt = require("bcrypt");


router.get("/userPage/:userID", function(req, res) {
    res.sendFile(path.join(__dirname + "/../files/user/user.html"))
})

router.route("/:userID")
    .get(function (req, res, next) {
        /*
        send: json data of the authentication
        send 404: if the authentication does not exist
        send 500: if there was an error with the database access
         */
        userDB.findOne({"_id":req.params.userID}).then(resolve => {
            if (resolve === null) {
                res.sendStatus(400);
                return;
            }
            res.data = resolve;
            next();
        }).catch(err => {
            console.log(err);
            res.sendStatus(500);
        })
    }, sendResponse)
    .patch(passport.authenticate('authentication', {session:false}), async function (req, res) {
        /*
        body: whatever should be updated
        send 204: if updated without problem
        send 403: if the authentication does not have the permission
        send 404: if the authentication could not be found
        send 500: if there was an error with the database
         */
        if (req.user.userID === req.params.userID) {
            await userDB.update({"_id": req.params.userID}, {"$set":req.body}, {}).then(resolve => {
                if (resolve === 1) {
                    res.sendStatus(204);
                } else if (resolve === 0) {
                    res.sendStatus(404);
                } else {
                    res.sendStatus(500);
                }
            })
        } else {
            res.sendStatus(403);
        }
    })
router.patch("/:userID/imp", passport.authenticate('authentication', {session:false}), async function (req, res) {
        /*
        body: whatever should be updated
        send 204: if updated without problem
        send 403: if the authentication does not have the permission
        send 404: if the authentication could not be found
        send 500: if there was an error with the database
         */
        if (req.user.userID === req.params.userID) {
            if (req.body.password !== undefined) {
                req.body.password = await bcrypt.hashSync(req.body.password, 10).toString();
            }
            await pwDB.update({"userID": req.params.userID}, {"$set":req.body}, {}).then(resolve => {
                if (resolve === 1) {
                    res.sendStatus(204);
                } else if (resolve === 0) {
                    res.sendStatus(404);
                } else {
                    res.sendStatus(500);
                }
            })
        } else {
            res.sendStatus(403);
        }
    })
module.exports = router