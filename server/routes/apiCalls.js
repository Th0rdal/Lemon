const axios = require('axios')

const express = require("express");
const router = express.Router();

function callIngredientsAPI(req, res, next) {
    let ingredientsUnparsed = req.body["ingredients"]
    console.log(ingredientsUnparsed)
    axios({
        method: "post",
        url:"http://127.0.0.1:5000",
        data:{"descriptions":ingredientsUnparsed}
    }).then(response => {
        let parsedIngredients = {}
        for (let index in response.data) {
            parsedIngredients[response.data[index]["name"]] = response.data[index]["quantity"] + " " + response.data[index]["unit"]
        }
        req.body["ingredients"] = parsedIngredients
        next();
    }).catch(error => {
        console.log(error);
        res.sendStatus(500)
    })
}

module.exports = {callIngredientsAPI}