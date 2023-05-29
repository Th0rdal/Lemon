const express = require('express');
const path = require('path');
const app = express();
const passport = require("passport");
require('./passport-config');

// Serve static content in directory 'files'
app.use(express.static(path.join(__dirname, 'files')));
app.use(express.urlencoded({extended:false})) //access to body elements with req.body.varName (name field of html tag)

app.use(passport.initialize())

const recipeRouter = require("./routes/recipe");
app.use("/recipe", recipeRouter);

const userRouter = require("./routes/user");
app.use("/user", userRouter);

const sessionRouter = require("./routes/session");

app.use("/", sessionRouter)

//test endpoint for authentication

app.get("/protected", passport.authenticate('authentication', {session:false}), function (req, res) {
    console.log("test");
    res.send("finished");
})


app.listen(3000);

console.log("Server now listening on http://localhost:3000/");
