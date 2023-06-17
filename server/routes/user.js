const express = require("express");
const router = express.Router();

const {user} = require("../database/database");
const userDB = new user();
const {sendResponse} = require('../middleware/formatResponse');
const passport = require("passport");
const {join} = require("path");

router.get("/userPage", function(req, res) {
    res.sendFile(join(__dirname + "/../files/user/user.html"))
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
    .patch(passport.authenticate('authentication', {session:false}), function (req, res) {
        /*
        body: whatever should be updated
        send 204: if updated without problem
        send 403: if the authentication does not have the permission
        send 404: if the authentication could not be found
        send 500: if there was an error with the database
         */
        if (req.user._id === req.params.userID) {
            userDB.update({"_id":req.params.userID}, req.body, {}).then(resolve => {
                if (resolve === 1) {
                    res.sendStatus(204);
                }else if (resolve === 0) {
                    res.sendStatus(404);
                }else {
                    res.sendStatus(500);
                }
            })
        }else {
            res.sendStatus(403);
        }
    }).delete(passport.authenticate('authentication', {session:false}), function (req, res) {
        /*
        send 204: if removed without problem
        send 404: if teh id could not be found
        send 500: if multiple authentication were removed (should never happen)
         */
        if (req.user._id === req.params.userID) {
            userDB.remove({"_id":req.params.userID}).then(resolve => {
                if (resolve === 1) {
                    res.sendStatus(204);
                }else if (resolve > 1) {
                    res.sendStatus(500);
                    throw new Error("Something went wrong. deleted 2 elements with the same ID")
                }else {
                    res.sendStatus(404)
                }
            })
        }else {
            res.sendStatus(403)
        }

    })

module.exports = router