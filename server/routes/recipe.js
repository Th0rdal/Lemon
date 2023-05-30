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

router.put("/", passport.authenticate('authentication', {session:false}), function (req, res) {
        /*
        query: title (str), method (array(string)), ingredients (object(string,number)), creator(string)
                , nutrition (object(string,number)), tags (array(string)), ratingStars (number)
                , ratingAmount (number), comments (number)
         send 204: if inserted without problem
         send 500: if the query is having errors
         */
        recipeDB.insert(req.body).then(() => {
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
    .patch(passport.authenticate('authentication', {session:false}), async function (req, res) {
        /*
        body-: whatever should be updated
        send 204: if updated without problem
        send 403: if the user was not the creator of the resource
        send 404: if the user could not be found
        send 500: if there was an error with the database
         */
        await recipeDB.isCreator(req.user, req.params.recipeID)
            .then(() => {
                recipeDB.update({"_id":req.params.recipeID}, req.body, {})
                    .then(resolve => {
                        if (resolve === 1) {
                            res.sendStatus(204);
                        }else if (resolve === 0) {
                            res.sendStatus(404);
                        }else {
                            res.sendStatus(500);
                        }
                        })
                    .catch(err => {
                        console.log(err);
                        res.sendStatus(500);
                    })
            }).catch(() => {
                res.sendStatus(403)
            })

    })
    .delete(passport.authenticate('authentication', {session:false}), async function (req, res) {
        /*
        send 204: if removed without problem
        send 403: if the user does not have permission
        send 404: if the id could not be found
        send 500: if multiple recipes were removed (should never happen)
        */
        await recipeDB.isCreator(req.user, req.params.recipeID)
            .then(() => {
                recipeDB.remove({'_id':req.params.recipeID})
                    .then(resolve => {
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
            .catch(() => {
                res.sendStatus(403)
            })

    })

router.route("/:recipe/comment")
    .post( passport.authenticate('authentication', {session:false}), function (req, res) {
        /*
        body: rating (string), comments (string)
        send 204: if request was successful
        send 500: if there was an error with the database access
        */
        commentsDB.insert(Object.assign({"_id":req.params.recipeID}, req.body)).then(() =>
            res.sendStatus(204)
        ).catch(err => {
            console.log(err);
            res.sendStatus(500);
        })
    })
    .delete(passport.authenticate('authentication', {session:false}), async function (req, res) {
        /*
        body: id of the comment to remove (important id key must be _id)
        send 204: delete was successful
        send 403: if the user does not have permission
        send 404: comment id could not be found
        send 500: if multiple recipes were removed (should never happen)
         */
        await commentsDB.isCreator(req.user, req.body._id)
            .then(() => {
                commentsDB.remove(req.body, {})
                    .then(resolve => {
                        if (resolve === 1) {
                            res.sendStatus(204);
                        }else if (resolve > 1) {
                            res.sendStatus(500);
                            throw new Error("Something went wrong. deleted 2 elements with the same ID");
                        }else {
                            res.sendStatus(404)
                        }
                    })
            }).catch(() => {
                res.sendStatus(403)
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
    .put(passport.authenticate('authentication', {session:false}), function (req, res) {
        /*
        body: recipeID (string), userID (string), ratingStar (number)
        send 204: if the request was successful
        send 500: if there was an error with database access
         */
        ratingDB.insert(Object.assign({"_id":req.params.recipeID}, req.body)).then(() => {
            res.sendStatus(204);
        }).catch(err => {
            console.log(err);
            res.sendStatus(500)
        })
    })
    .delete(passport.authenticate('authentication', {session:false}), function (req, res) {
        /*
        body: id of the comment to remove (important id key must be _id)
        send 204: delete was successful
        send 403: if the user does not have permission
        send 404: comment id could not be found
        send 500: if multiple recipes were removed (should never happen)
         */
        ratingDB.isCreator(req.user, req.query._id)
            .then(() => {
                ratingDB.remove(req.body, {})
                    .then(resolve => {
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
            .catch(() => {
                res.sendStatus(403)
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