const express = require("express")
const router = express.Router()

const NotImplementedException = require("../server_exceptions");

router.get("/ofTheDay", function (req, res) {
    //implement
    throw new NotImplementedException()
})

router.route("/:recipeID")
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
    })
    .delete(function (req, res) {
        //implement
        throw new NotImplementedException();
    })

router.post("/:recipeID/comment", function (req, res) {
    //implement
    throw new NotImplementedException();
})

router.get("/:recipeID/comments", function (req, res) {
    //implement
    throw new NotImplementedException();
})

router.get("/:recipeID/rating", function (req, res) {
    //implement
    throw new NotImplementedException();
})
route.get("/:recipeID/ratings", function (req, res) {
    //implement
    throw new NotImplementedException();
})


module.exports = router