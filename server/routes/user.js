const express = require("express")
const router = express.Router()

const NotImplementedException = require("../server_exceptions");

router.route("/:userID")
    .get(function (req, res) {
        //implement
        throw new NotImplementedException();
    })
    .put(function (req, res) {
        //implement
        throw new NotImplementedException();
    })
    .patch(function (req, res) {
        //implement
        throw new NotImplementedException();
    }).delete(function (req, res) {
        //implement
        throw new NotImplementedException();
    })

module.exports = router