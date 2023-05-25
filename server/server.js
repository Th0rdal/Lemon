const express = require('express');
const path = require('path');
const app = express();
const NotImplementedException = require("./server_exceptions");

// Serve static content in directory 'files'
app.use(express.static(path.join(__dirname, 'files')));

const recipeRouter = require("./routes/recipe");
app.use("/recipe", recipeRouter);

const userRouter = require("./routes/user");
app.use("/user", userRouter);

app.listen(3000);

console.log("Server now listening on http://localhost:3000/");
