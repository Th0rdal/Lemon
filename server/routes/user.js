const express = require("express");
const router = express.Router();

const {user} = require("../database/database");
const userDB = new user();
const {sendResponse} = require('../tools');
const passport = require("passport");

router.route("/:userID")
    .get(function (req, res) {
        /*
        send: json data of the user
        send 404: if the user does not exist
        send 500: if there was an error with the database access
         */
        userDB.findOne({"_id":req.params.userID}).then(resolve => {
            if (resolve === null) {
                res.sendStatus(404);
                return;
            }
            res.json(resolve);
        }).catch(err => {
            console.log(err);
            res.sendStatus(500);
        })
    }, sendResponse)
    .patch(passport.authenticate('authentication', {session:false}), function (req, res) {
        /*
        query: whatever should be updated
        send 204: if updated without problem
        send 403: if the user does not have the permission
        send 404: if the user could not be found
        send 500: if there was an error with the database
         */
        if (req.user._id === req.params.userID) {
            userDB.update({"_id":req.params.userID}, req.query, {}).then(resolve => {
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
        send 500: if multiple user were removed (should never happen)
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