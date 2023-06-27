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


//test endpoints
//
// app.get("/protected", passport.authenticate('authentication', {session: false}), function (req, res) {
//     console.log("test");
//     res.send("finished");
// })
//
// app.put("/testBody", function (req, res, next) {
//     console.log("newBody")
//     //res.send("DONE");
//     next()
// }, sendResponse)
//
// app.get("/queryTest", function (req, res) {
//     sendMail()
//         .then(result => console.log("Email sent...", result))
//         .catch(error => console.log(error.message))
// })

app.get('/meals', function (req, res) {
    // Führe die GET-Anfrage an die API aus
    /*axios.get('https://www.themealdb.com/api/json/v1/1/random.php')
        .then(response => {
            const meal = response.data.meals[0];
            // Sende die Antwort an den Client
            res.send(meal);
        })
        .catch(error => {
            console.error(error);
            // Behandle den Fehler und sende eine entsprechende Antwort an den Client
            res.status(500).send('Fehler beim Abrufen des zufälligen Gerichts');
        });*/
    res.sendFile(path.join(__dirname + "/resources/img/none.jpg"));
});


app.listen(3000, function (){
    console.log("Server now listening on http://localhost:3000/");
})


