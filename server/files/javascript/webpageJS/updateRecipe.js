import {
    ingredientsBuilder,
    methodBuilder,
    createTag,
    clearEmptyFields,
    checkDifficulty,
    getFormData
} from "../tools/recipeHelper"
import {getCookie} from "../tools/cookies";

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

document.addEventListener("load", function() {
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
        xhr.open("PATCH", "/recipe/"+recipeID)
        xhr.setRequestHeader("Authorization", getCookie("jwt"))
        xhr.setRequestHeader("Content-Type", "application/json")
        xhr.send(JSON.stringify(data));
    })
})