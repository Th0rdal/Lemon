const axios = require('axios')

const express = require("express");
const router = express.Router();

const nodemailer = require("nodemailer")
const {google} = require("googleapis")

const CLIENT_ID = "972571660984-clavejj9hkj4j64nssm21g7vp46i70qh.apps.googleusercontent.com"
const CLIENT_SECRET = "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"
const REDIRECT_URI = "https://developers.google.com/oauthplayground"
const TOKEN = "1//04pJ3X7HiI_UWCgYIARAAGAQSNwF-L9IrA4CDwK8K-xt-cqu1pKVI8d8bEjRCi2AYNGPd58c53DNpbeaj9tr7Q4snMUA4HtlMOgM"
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)

const API_KEY = "W8JauylDBqE7bqr2vPOax9wgV8GAlezjBQg54k2a"
oAuth2Client.setCredentials({refresh_token: TOKEN})

function callIngredientsAPI(req, res, next) {
    let ingredientsUnparsed = req.body["ingredients"]
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

async function callNutritionAPI(req, res, next) {
    if (API_KEY === "") {
        next();
        return;
    }
    for (let ingredient in req.body["ingredients"]) {
        let response = await axios({
            method: "get",
            url: "https://api.nal.usda.gov/fdc/v1/foods/search",
            params: {
                "api_key": API_KEY,
                "query": ingredient
            }
        })
        req.body.nutrition = {}
        for (let nutrient of response.data.foods[0].foodNutrients) {
            req.body.nutrition[nutrient.nutrientName] = nutrient.value * (Number(req.body["ingredients"][ingredient].substring(0, req.body["ingredients"][ingredient].lastIndexOf(" ")))/100)
        }
    }
    next();

}

async function sendMail(url, email) {
    try {
        if (CLIENT_ID === "") {
            throw new Error("Client secret info not included");
        }
        const accessToken = await oAuth2Client.getAccessToken();
        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "webprojectlemon@gmail.com",
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: TOKEN,
                accessToken: accessToken
            }
        })

        const mailOptions = {
            from: "webprojectlemon@gmail.com",
            to: email, //"webprojectlemon@gmail.com",
            subject: "Authenticate your email address",
            text: `Dear user!\n\nPlease click this link to verify your email address ${url}\n\nYour Lemon Team`
        }
        return await transport.sendMail(mailOptions)
    }catch (error) {
        return error;
    }
}

module.exports = {callIngredientsAPI, sendMail, callNutritionAPI}