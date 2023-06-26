import userPageBuilder from "../builder/userPageBuilder.js"
import {getCookie} from "../tools/cookies.js";
import {RecipeCoverBuilder} from "../builder/RecipeCoverBuilder.js";


document.addEventListener("DOMContentLoaded", function() {
    const userID = window.location.href.substring(window.location.href.lastIndexOf("/")+1)
    let username = "test";
    if (userID === getCookie("userID")) {
        username = getCookie("username");
    }
    new userPageBuilder(false, {"username":username}).appendTo(document.getElementById("main"));
    let xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (xhr.status === 200) {
            console.log(JSON.parse(xhr.responseText))
            const recipes = JSON.parse(xhr.responseText)["postedRecipes"];
            for (let recipeID of recipes) {
                console.log(recipeID)
                let recipeRequest = new XMLHttpRequest();
                recipeRequest.onload = function() {
                    if (recipeRequest.status === 200) {
                        new RecipeCoverBuilder(JSON.parse(recipeRequest.responseText)).appendTo(document.getElementById("recipeCoverWrapper"))
                    }
                }
                recipeRequest.open("GET", "http://localhost:3000/recipe/"+recipeID);
                recipeRequest.send();

            }
        }
    }

    xhr.open("GET", "/user/"+userID)
    xhr.send();
})