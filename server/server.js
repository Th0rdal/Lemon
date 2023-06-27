const express = require('express');
const path = require('path');
const passport = require("passport");
const xmlBodyParser = require('express-xml-bodyparser')
const axios = require('axios');


require('./middleware/authentication');
const {preventStaticSending} = require('./middleware/preventStaticSending');
const {parseXML} = require('./middleware/formatRequest');
const {getProjectDirectory, sendResponse} = require('./middleware/formatResponse');
const {createIsAuthenticated} = require('./middleware/authentication')

const app = express();

// Serve static content in directory 'files'
app.use(express.static(path.join(__dirname, 'files')));
//app.use(express.static(path.join(__dirname)));
app.use(preventStaticSending);

//body parsing
app.use(express.json());
app.use(xmlBodyParser());
app.use(express.urlencoded({extended: false})) //access to body elements with req.body.varName (name field of html tag)
app.use(parseXML);

//authentication initializing
app.use(passport.initialize())

app.use(createIsAuthenticated);

app.get("/resources/img/:name", function(req, res) {
    name = req.params.name;
    res.sendFile(path.join(__dirname + "/resources/img/" + name + ".jpg"))
})

//adding routes
const recipeRouter = require("./routes/recipe");
app.use("/recipe", recipeRouter);

const userRouter = require("./routes/user");
app.use("/user", userRouter);

const sessionRouter = require("./routes/session");
app.use("", sessionRouter)

const filterRouter = require("./routes/filter.js");
const {createWriteStream} = require("fs");
//const axios = require("axios");
app.use("", filterRouter);

app.listen(3000, function (){
    console.log("Server now listening on http://localhost:3000/");
})


