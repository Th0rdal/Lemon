const express = require("express")
const router = express.Router()
const NotImplementedException = require("../server_exceptions");
const {recipe} = require("../database/database")
const recipeDB = new recipe()
const {rating} = require("../database/database")
const ratingDB = new rating();
const {comments} = require("../database/database")
const commentsDB = new comments();
let recipeOfTheDay = {"title": "recipeOfTheDay"}
router.get("/ofTheDay", function (req, res) {
    res.json(recipeOfTheDay);
})

router.route("/:recipeID")
    .get(function (req, res) {
        /*
        send: json data of the recipe if the database access was successful
        send: status code 500 if there was an error with the database access
        */
        recipeDB.findOne({'_id':req.params.recipeID}).then(resolve => {
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
    })
    .delete(function (req, res) {
        /*
        send 204: if removed without problem
        send 500: if multiple recipes were removed (should never happen)
        send 404: if the id could not be found
        */
        recipeDB.remove({'_id':req.params.recipeID}).then(resolve => {
            if (resolve === 1) {
                res.sendStatus(204);
            }else if (resolve > 1) {
                res.sendStatus(500);
                throw new Error("Something went wrong. deleted 2 elements with the same ID");
            }else {
                res.sendStatus(404)
            }
        })
    })

router.post("/:recipeID/comment", function (req, res) {
    //implement
    throw new NotImplementedException();
})

router.get("/:recipeID/comments", function (req, res) {
    /*
    send: json data of the comments of the recipe
    send 500: if there was an error retrieving the data
     */
    commentsDB.find({"recipeID":req.params.recipeID}).then(resolve => {
            res.json(resolve);
    }).catch(err => {
        console.log(err);
        res.sendStatus(500);
    })
})

router.get("/:recipeID/ratings", function (req, res) {
    /*
    send: json data of the ratings of the recipe
    send 500: if there was an error retrieving the data
     */
    ratingDB.find({"recipeID":req.params.recipeID}).then(resolve => {
        res.json(resolve);
    }).catch(err => {
        console.log(err)
        res.sendStatus(500);
    })
})

function newRecipeOfTheDay() {
    /*
    this function defines a new recipe of the day and saves it in recipeOfTheDay. it gets executed every day
    at 9am.
     */
    let letter = Math.floor(Math.random() * 27) * 65
    recipeDB.findOne({'_id':new RegExp(String.fromCharCode(letter))}).then((resolve => {
      recipeOfTheDay = resolve;
    }))
}

function scheduleNewRecipeOfTheDay() {
    /*
    this function schedules the next execution of newRecipeOfTheDay.
     */
    const now = new Date();
    const nextExecution = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, 0, 0);
    if (now > nextExecution) {
        nextExecution.setDate(nextExecution.getDate()+1);
    }
    const delay = nextExecution - now;
    setTimeout(function () {
        newRecipeOfTheDay();
        scheduleNewRecipeOfTheDay()
    }, delay)
}

//scheduleNewRecipeOfTheDay();

module.exports = router