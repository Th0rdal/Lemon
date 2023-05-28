const express = require("express")
const router = express.Router()
const {user} = require("../database/database")
const userDB = new user();

const NotImplementedException = require("../server_exceptions");

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
            res.sendStatus(500);
        })
    })
    .put(function (req, res) {
        //implement
        throw new NotImplementedException();
    })
    .patch(function (req, res) {
        //implement
        throw new NotImplementedException();
    }).delete(function (req, res) {
        /*
        send 204: if removed without problem
        send 500: if multiple user were removed (should never happen)
        send 404: if teh id could not be found
         */
        userDB.remove({"_id":req.params.userID}).then(resolve => {
            if (resolve === 1) {
                res.sendStatus(204);
            }else if (resolve > 1) {
                res.sendStatus(500);
                throw new Error("Something went wrong. deleted 2 elements with the same ID")
            }else [
                res.sendStatus(404)
            ]
        })
    })

module.exports = router