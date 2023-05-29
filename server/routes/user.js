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
    .patch(passport.authenticate('jwt', {session:false}), function (req, res) {
        /*
        query: whatever should be updated
        send 204: if updated without problem
        send 404: if the user could not be found
        send 500: if there was an error with the database
         */
        console.log("requires stricter authentication: " + req.url)
        userDB.update({"_id":req.params.userID}, req.query, {}).then(resolve => {
            if (resolve === 1) {
                res.sendStatus(204);
            }else if (resolve === 0) {
                res.sendStatus(404);
            }else {
                res.sendStatus(500);
            }
        })
    }).delete(passport.authenticate('jwt', {session:false}), function (req, res) {
        /*
        send 204: if removed without problem
        send 500: if multiple user were removed (should never happen)
        send 404: if teh id could not be found
         */
        console.log("requires stricter authentication: " + req.url)
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
    })

module.exports = router