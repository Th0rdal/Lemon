import {getCookie} from "http://localhost:3000/javascript/tools/cookies.js"
import {clearEmptyFields, checkDifficulty, getFormData} from "http://localhost:3000/javascript/tools/recipeHelper.js"
import {fileToUpload} from "http://localhost:3000/javascript/tools/dragDrop.js"

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("formTitle").textContent = "create a new recipe:";

    document.getElementById("submitButton").addEventListener("click", function() {
        clearEmptyFields()
        if (!checkDifficulty()) {
            return;
        }

        let data = getFormData();
        data["imageToUpload"] = fileToUpload
        let xhr = new XMLHttpRequest();
        xhr.onload = function() {
            console.log("DONE");
        }
        xhr.open("POST", "/recipe")
        xhr.setRequestHeader("Authorization", getCookie("jwt"))
        xhr.setRequestHeader("Content-Type", "application/json")
        xhr.send(JSON.stringify(data));
    })
})