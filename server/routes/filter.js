const express = require("express");
const router = express.Router();

const {recipe} = require("../database/database");
const {sendResponse} = require("../middleware/formatResponse");
const recipeDB = new recipe();

router.get("/filter", function(req, res, next) {
    recipeDB.find({$where: function() {
        if (!Array.isArray(req.query.i) && req.query.i !== undefined) {
            if (!Object.keys(this.ingredients).includes(req.query.i.toLowerCase())) {
                return false;
            }
        }else {
            for (let key in req.query.i) {
                if (!Object.keys(this.ingredients).includes(req.query.i[key].toLowerCase())) {
                    return false;
                }
            }
        }

        if (req.query.s !== undefined) {
            return this.title.includes(req.query.s);
        }
        return true;

    }
    }).then(resolve => {
        let counter = 0;
        res.data = {}
        let recipeAmount = -1
        if (req.query.amount !== undefined) {
            recipeAmount = req.query.amount;
        }
        for (let recipe of resolve) {
            res.data[counter] = recipe;
            counter++;
            if (counter === recipeAmount) {
                break;
            }
        }
        next();
    }).catch(err => {
        console.log(err);
        res.sendStatus(500);
    })
}, sendResponse)

module.exports = router;