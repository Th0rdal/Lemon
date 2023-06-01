const express = require("express");
const router = express.Router();

const {recipe} = require("../database/database");
const recipeDB = new recipe();

module.exports = router;