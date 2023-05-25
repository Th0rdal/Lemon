const express = require('express')
const path = require('path')
const app = express()
const NotImplementedException = require("./server_exceptions")

// Serve static content in directory 'files'
app.use(express.static(path.join(__dirname, 'files')));

app.get("/recipe/ofTheDay", function (req, res) {
    //implement
    throw new NotImplementedException()
})

app.listen(3000)

console.log("Server now listening on http://localhost:3000/")
