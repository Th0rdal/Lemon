import userPageBuilder from "../builder/userPageBuilder.js"
import {getCookie} from "../tools/cookies.js";
import {RecipeCoverBuilder} from "../builder/RecipeCoverBuilder.js";


document.addEventListener("DOMContentLoaded", async function () {
    const userID = window.location.href.substring(window.location.href.lastIndexOf("/") + 1)
    let username = "";
    let ownPage = false;
    if (userID === getCookie("userID")) {
        username = getCookie("username");
        ownPage = true;
    } else {
        let response = await fetch(`http://localhost:3000/user/${userID}`)
        let body = await response.json();
        username = body.username
    }
    new userPageBuilder(ownPage, {"username": username}).appendTo(document.getElementById("main"));
    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.status === 200) {
            const recipes = JSON.parse(xhr.responseText)["postedRecipes"];
            for (let recipeID of recipes) {
                let recipeRequest = new XMLHttpRequest();
                recipeRequest.onload = function () {
                    if (recipeRequest.status === 200) {
                        console.log(JSON.parse(recipeRequest.responseText))
                        new RecipeCoverBuilder(JSON.parse(recipeRequest.responseText), true).appendTo(document.getElementById("recipeCoverWrapper"))
                    }
                }
                recipeRequest.open("GET", "http://localhost:3000/recipe/configure/" + recipeID);
                recipeRequest.send();

            }
        }
    }

    xhr.open("GET", "/user/" + userID)
    xhr.send();
})