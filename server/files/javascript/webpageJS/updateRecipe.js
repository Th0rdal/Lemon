import {
    ingredientsBuilder,
    methodBuilder,
    createTag,
    clearEmptyFields,
    checkDifficulty,
    getFormData
} from "http://localhost:3000/javascript/tools/recipeHelper.js"
import {getCookie} from "http://localhost:3000/javascript/tools/cookies.js";

let oldData;

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

function getUpdateData() {
    const data = getFormData();
    const newData = {"$set":{}}
    for (let key in data) {
        if (data[key] !== oldData[key]) {
            newData["$set"][key] = data[key]
        }
    }
    return newData;
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("formTitle").textContent = "update recipe:";

    let xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (xhr.status === 200) {
            oldData = JSON.parse(xhr.responseText)
            loadRecipe(oldData)
        }
    }
    let recipeID = window.location.href.substring(window.location.href.lastIndexOf("/")+1)
    xhr.open("GET", window.location.origin + "/recipe/" + recipeID)
    xhr.send()

    let button = document.createElement("input")
    button.value = "delete Recipe"
    button.type = "submit"
    button.onclick = function() {
        let xhr = new XMLHttpRequest();
        xhr.onload = function() {
            window.location.href = "/";
        }
        xhr.open("DELETE", "recipe/configure/" + recipeID)
        xhr.send()
    }

    button = document.createElement("input")
    button.value = "change Recipe"
    button.type = "submit"
    button.onclick = function() {
        let xhr = new XMLHttpRequest();
        xhr.onload = function() {
            window.location.href = "/recipe/update/" + recipeID;
        }
        xhr.open("DELETE", "recipe/configure/" + recipeID)
        xhr.send()
    }

    document.getElementById("createRecipeForm").appendChild(button);
    document.getElementById("submitButton").addEventListener("click", function() {
        clearEmptyFields()
        if (!checkDifficulty()) {
            return;
        }

        let data = getUpdateData();
        let xhr = new XMLHttpRequest();
        xhr.onload = function() {
            console.log("DONE");
        }
        xhr.open("PATCH", "/recipe/configure/"+recipeID)
        xhr.setRequestHeader("Authorization", getCookie("jwt"))
        xhr.setRequestHeader("Content-Type", "application/json")
        xhr.send(JSON.stringify(data));
    })
})