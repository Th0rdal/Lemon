const express = require('express');
const path = require('path');
const passport = require("passport");
const xmlBodyParser = require('express-xml-bodyparser')
require('./middleware/passport-config');
const {preventStaticSending} = require('./middleware/preventStaticSending');
const {parseXML} = require('./middleware/formatRequest');
const {getProjectDirectory, sendResponse} = require('./middleware/formatResponse');
const app = express();


// Serve static content in directory 'files'
app.use(express.static(path.join(__dirname, 'files')));
app.use(express.static(path.join(__dirname)));
app.use(preventStaticSending);

//body parsing
app.use(express.json());
app.use(xmlBodyParser());
app.use(express.urlencoded({extended:false})) //access to body elements with req.body.varName (name field of html tag)
app.use(parseXML);

//authentication initializing
app.use(passport.initialize())

//adding routes
const recipeRouter = require("./routes/recipe");
app.use("/recipe", recipeRouter);

const userRouter = require("./routes/user");
app.use("/user", userRouter);

const sessionRouter = require("./routes/session");

app.use("", sessionRouter)

//test endpoints

app.get("/protected", passport.authenticate('authentication', {session:false}), function (req, res) {
    console.log("test");
    res.send("finished");
})

app.put("/testBody", function (req, res, next) {
    console.log("newBody")
    //res.send("DONE");
    next()
}, sendResponse)

app.listen(3000);

console.log("Server now listening on http://localhost:3000/");
