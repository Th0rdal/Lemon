const express = require("express");
const router = express.Router();

const {recipe} = require("../database/database");
const {sendResponse} = require("../middleware/formatResponse");
const recipeDB = new recipe();

router.get("/ingredients", function(req, res, next) {
    recipeDB.find({$where: function() {
        for (let key in req.query.i) {
            if (!Object.keys(this.ingredients)) {
                return false;
            }
        }
        return !(req.query.s !== undefined && req.query.s !== this.title);

    }
    }).then(resolve => {
        let counter = 0;
        res.data = {}
        for (let recipe of resolve) {
            res.data[counter] = recipe;
        }
        next();
    }).catch(err => {
        console.log(err);
        res.sendStatus(500);
    })
}, sendResponse)

module.exports = router;