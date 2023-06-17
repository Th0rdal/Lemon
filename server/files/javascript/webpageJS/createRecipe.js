import {getCookie} from "../tools/cookies";
import {clearEmptyFields, checkDifficulty, getFormData} from "../tools/recipeHelper"

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("formTitle").textContent = "create a new recipe:";

    document.getElementById("submitButton").addEventListener("click", function() {
        clearEmptyFields()
        if (!checkDifficulty()) {
            return;
        }

        let data = getFormData();
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