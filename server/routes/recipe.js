const express = require("express");

const router = express.Router();
const {recipe} = require("../database/database");
const recipeDB = new recipe();
const {rating} = require("../database/database");
const ratingDB = new rating();
const {comments} = require("../database/database");
const commentsDB = new comments();
const {sendResponse} = require("../tools");
const passport = require('passport');
const NotImplementedException = require("../server_exceptions");

let recipeOfTheDay = {"title": "recipeOfTheDay"}

router.get("/ofTheDay", function (req, res) {
    res.json(recipeOfTheDay);
})

router.put("/", passport.authenticate('jwt', {session:false}), function (req, res) {
        /*
        query: title (str), method (array(string)), ingredients (object(string,number)), creator(string)
                , nutrition (object(string,number)), tags (array(string)), ratingStars (number)
                , ratingAmount (number), comments (number)
         send 204: if inserted without problem
         send 500: if the query is having errors
         */
        recipeDB.insert(req.query).then(() => {
            res.sendStatus(204)
        }).catch(err => {
            console.log(err)
            res.sendStatus(500)
        })
    })

router.route("/:recipeID")
    .get(function (req, res, next) {
        /*
        send: json data of the recipe
        send 404: if the recipe does not exist
        send 500: if there was an error with the database access
        */
        recipeDB.findOne({'_id':req.params.recipeID}).then(resolve => {
            if (resolve === null) {
                res.sendStatus(404);
                return;
            }
            res.data = resolve;
            next();
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
        recipeDB.update({"_id":req.params.recipeID}, req.query, {}).then(resolve => {
            if (resolve === 1) {
                res.sendStatus(204);
            }else if (resolve === 0) {
                res.sendStatus(404);
            }else {
                res.sendStatus(500);
            }
        }).catch(err => {
            console.log(err);
            res.sendStatus(500);
        })
    })
    .delete(passport.authenticate('jwt', {session:false}), function (req, res) {
        /*
        send 204: if removed without problem
        send 500: if multiple recipes were removed (should never happen)
        send 404: if the id could not be found
        */
        console.log("requires stricter authentication: " + req.url)
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

router.route("/:recipe/comment")
    .post( passport.authenticate('jwt', {session:false}), function (req, res) {
        /*
        query: rating (string), comments (string)
        send 204: if request was successful
        send 500: if there was an error with the database access
        */
        console.log("requires stricter authentication: " + req.url)
        commentsDB.insert(Object.assign({"_id":req.params.recipeID}, req.query)).then(() =>
            res.sendStatus(204)
        ).catch(err => {
            console.log(err);
            res.sendStatus(500);
        })
    })
    .delete(passport.authenticate('jwt', {session:false}), function (req, res) {
        /*
        query: id of the comment to remove
        send 204: delete was successful
        send 404: comment id could not be found
        send 500: if multiple recipes were removed (should never happen)
         */
        console.log("requires stricter authentication: " + req.url)
        commentsDB.remove(req.query, {}).then(resolve => {
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

router.get("/:recipeID/comments", function (req, res, next) {
    /*
    send: json data of the comments of the recipe
    send 500: if there was an error retrieving the data
     */
    commentsDB.find({"recipeID":req.params.recipeID}).then(resolve => {
            res.data = resolve;
            next()
    }).catch(err => {
        console.log(err);
        res.sendStatus(500);
    })
}, sendResponse)

router.put("/:recipeID/comments", passport.authenticate('jwt', {session:false}), function(req, res)  {
    /* usefull?
    query: userID (string), comment (string)
    send 204: if request was successful
    send 500: if there was an error retrieving the data
     */
    commentsDB.insert(Object.assign({"recipeID":req.params.recipeID}, req.query)).then(() => {
        res.sendStatus(204);
    }).catch(err => {
        console.log(err);
        res.sendStatus(500);
    })
});

router.get("/:recipeID/ratings", function (req, res, next) {
    /*
    send: json data of the ratings of the recipe
    send 500: if there was an error retrieving the data
     */
    ratingDB.find({"recipeID":req.params.recipeID}).then(resolve => {
        res.data = resolve;
        next();
    }).catch(err => {
        console.log(err)
        res.sendStatus(500);
    })
})

router.route("/:recipeID/rating")
    .put(passport.authenticate('jwt', {session:false}), function (req, res) {
        //implement
        throw new NotImplementedException();
    })
    .delete(passport.authenticate('jwt', {session:false}), function (req, res) {
        //implement
        throw new NotImplementedException();
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