import {ingredientsBuilder, methodBuilder, createTag} from "../tools/recipeHelper"

function loadRecipe(recipe) {
    document.getElementById("title").textContent = recipe["title"];
    for (let key in recipe["ingredients"]) {
        ingredientsBuilder().textContent = `${recipe["ingredients"][key]} ${key}`
    }
    for (let key in recipe["method"]) {
        methodBuilder().textContent = `${recipe["ingredients"][key]}`
    }
    document.getElementById("timeToMake").textContent = Number(recipe["timeToMake"])
    document.getElementById("dropdown-button").textContent = recipe["difficulty"]
    for (let tag in recipe["tags"]) {
        createTag(tag);
    }

}

document.addEventListener("load", function() {
    document.getElementById("formTitle").textContent = "update recipe:";

    let xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (xhr.status === 200) {
            loadRecipe(JSON.parse(xhr.responseText))
        }
    }
    let recipeID = window.location.href.substring(window.location.href.lastIndexOf("/")+1)
    xhr.open("GET", window.location.origin + "/recipe/" + recipeID)
    xhr.send()
})