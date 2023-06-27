const express = require("express");
const path = require('path');

const router = express.Router();
let {recipe} = require("../database/database");
const recipeDB = new recipe();
const {user} = require("../database/database");
const userDB = new user();
const {rating} = require("../database/database");
const ratingDB = new rating();
const {comments} = require("../database/database");
const commentsDB = new comments();
const {sendResponse} = require("../middleware/formatResponse");
const passport = require('passport');
const {callIngredientsAPI, callNutritionAPI} = require("../middleware/apiCalls")
const {createWriteStream, writeFile} = require("fs");

//dummy recipe of the day
let recipeOfTheDay = {"difficulty":"easy",
    "ratingStars":0,
    "ratingAmount":0,
    "comments":0,
    "nutrition":[],
    "image":"NONE",
    "method":["ef"],
    "ingredients":{"ef":" "},
    "tags":["vegan","easy"],
    "creatorID":"N2pdJKbgtR2I4Aw5",
    "title":"sfd","timeToMake":32,
    "_id":"9s1SeETEK3HJJCQt",
    "createdAt":{"$$date":1687800583062},
    "updatedAt":{"$$date":1687800583062}
}


router.get("/createRecipe", function(req, res) {
    res.sendFile(path.join(__dirname + "/../files/recipe/createRecipe.html"))
})

router.get("/tags", function(req, res, next) {
    res.data = {
        "choosableTags":["vegan", "vegetarian"],
        "nonChoosableTags": ["easy", "medium", "hard"]
    };
    next();

}, sendResponse)

router.get("/ofTheDay", function (req, res, next) {
    /*
    send: json with the recipe of the day
     */
    res.data = recipeOfTheDay;
    next();
}, sendResponse)

router.post("/", passport.authenticate('authentication', {session:false}), callIngredientsAPI, callNutritionAPI, function (req, res) {
        /*
        body: title (str), method (array(string)), ingredients (object(string,number)), creator(string)
                , nutrition (object(string,number)), tags (array(string)), ratingStars (number)
                , ratingAmount (number), comments (number)
         send 204: if inserted without problem
         send 500: if the query is having errors
         */
        req.body["timeToMake"] = Number(req.body["timeToMake"])
        req.body["tags"].push(req.body["difficulty"])
        let image = req.body.imageToUpload
        delete req.body.imageToUpload
        recipeDB.insert(req.body).then(() => {
            recipeDB.findOne(req.body).then(async resolve => {
                if (resolve === null) {
                    deleteRecipe(req.body)
                    res.sendStatus(500);
                    return;
                }
                let result = await userDB.update({"_id": req.body.creatorID}, {"$push": {"postedRecipes": resolve._id}}, {})
                if (result !== 1) {
                    deleteRecipe(req.body)
                    res.sendStatus(500)
                    return;
                }
                if (image === null) {
                    return;
                }
                const imageBuffer= Buffer.from(image["image"], "base64")
                writeFile(__dirname + "/../resources/img/"+resolve._id+image["ending"], imageBuffer, err => {
                    console.error(err);
                })
                await recipeDB.update({"_id": resolve._id}, {$set: {"image": resolve._id}}, {})
                res.sendStatus(204)
            })
        }).catch(err => {
            console.log(err)
            res.sendStatus(500)
        })
    })

router.route("/configure/:recipeID")
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
        send 403: if the authentication was not the creator of the resource
        send 404: if the authentication could not be found
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
        send 403: if the authentication does not have permission
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

router.route("/:recipeID/comment")
    .post( passport.authenticate('authentication', {session:false}), async function (req, res) {
        /*
        body: rating (string), comments (string)
        send 204: if request was successful
        send 500: if there was an error with the database access
        */
        commentsDB.insert(Object.assign({"recipeID": req.params.recipeID}, req.body)).then(async () => {
            let recipe = await recipeDB.findOne({"_id": req.params.recipeID})
            await recipeDB.update({"_id": req.params.recipeID}, {"$set": {"comments": recipe.comments + 1}}, {})
            res.sendStatus(204)
        }).catch(err => {
            console.log(err);
            res.sendStatus(500);
        })
    })
    .delete(passport.authenticate('authentication', {session:false}), async function (req, res) {
        /*
        body: id of the comment to remove (important id key must be _id)
        send 204: delete was successful
        send 403: if the authentication does not have permission
        send 404: comment id could not be found
        send 500: if multiple recipes were removed (should never happen)
         */
        await commentsDB.isCreator(req.user, req.body._id)
            .then(() => {
                commentsDB.remove({"_id":req.body._id}, {})
                    .then(async resolve => {
                        if (resolve === 1) {
                            let recipe = await recipeDB.findOne({"_id": req.params.recipeID})
                            await recipeDB.update({"_id": req.params.recipeID}, {"$set": {"comments": recipe.comments - 1}}, {})
                            res.sendStatus(204);
                        } else if (resolve > 1) {
                            res.sendStatus(500);
                            throw new Error("Something went wrong. deleted 2 elements with the same ID");
                        } else {
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
            next();
    }).catch(err => {
        console.log(err);
        res.sendStatus(500);
    })
}, sendResponse)

router.route("/:recipeID/rating")
    .put(passport.authenticate('authentication', {session:false}), async function (req, res) {
        /*
        body: recipeID (string), userID (string), ratingStar (number)
        send 204: if the request was successful
        send 500: if there was an error with database access
         */
        let increment = 0
        let existingRating = await ratingDB.findOne({"recipeID": req.params.recipeID, "creatorID": req.body.creatorID})
        if (existingRating === null) {
            ratingDB.insert(Object.assign({"recipeID": req.params.recipeID}, req.body)).catch(err => {
                console.log(err);
                res.sendStatus(500)
            })
            increment = 1
        }else {
            let update = await ratingDB.update({"recipeID": req.params.recipeID, "creatorID": req.body.creatorID}, {"$set":{"ratingStar":req.body.ratingStar}}, {})
            if (update === 0) {
                res.sendStatus(500)
                return;
            }
        }
        let recipe = await recipeDB.findOne({"_id":req.params.recipeID})
        let x = await ratingDB.find({"recipeID":req.params.recipeID})
        let newRatingStars = 0;
        for (let t of x) {
            newRatingStars = newRatingStars + t.ratingStar
        }
        newRatingStars = newRatingStars / recipe.ratingAmount+increment;
        console.log(newRatingStars)
        await recipeDB.update({"_id":req.params.recipeID}, {"$set":{"ratingStars":newRatingStars, "ratingAmount":recipe.ratingAmount+increment}}, {})
        res.sendStatus(204)
    })
router.get("/update/:recipeID", function(req, res) {
    res.sendFile(path.join(__dirname + "/../files/recipe/updateRecipe.html"))
})

router.get("/:recipeID", function(req, res) {
    res.sendFile(path.join(__dirname + "/../files/recipe/recipe.html"))
})

function deleteRecipe(recipe) {
    recipeDB.remove(recipe).then(resolve => {
        if (resolve === 1) {
            return;
        }
        console.log("something went very wrong")
    })
}

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