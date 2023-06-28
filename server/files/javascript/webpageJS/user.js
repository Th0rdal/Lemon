import userPageBuilder from "../builder/userPageBuilder.js"
import {getCookie} from "../tools/cookies.js";
import {RecipeCoverBuilder} from "../builder/RecipeCoverBuilder.js";

function checkPasswords() {
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirm_password");

    if (!password.checkValidity()) {
        document.getElementById("dot").style.color = "red";
    }else {
        document.getElementById("dot").style.color = "green";
    }
    if (password.value !== confirmPassword.value || !password.checkValidity()) {
        document.getElementById("confirmDot").style.color = "red";
        return false;
    }else {
        document.getElementById("confirmDot").style.color = "green";
        return true;
    }
}

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
    let span = document.createElement("span");
    span.id = "dot";
    span.classList.add("big-dot");
    span.textContent = '•';
    document.getElementById("passwordParagraph").querySelector("label").appendChild(span);

    span = document.createElement("span");
    span.id = "confirmDot";
    span.classList.add("big-dot");
    span.textContent = '•';
    document.getElementById("confirm_passwordParagraph").querySelector("label").appendChild(span);

    document.getElementById("saveOptions").addEventListener("click", function(event) {
        event.preventDefault();
        let xhr = new XMLHttpRequest();
        xhr.open("PATCH", "/user/"+getCookie("userID"))
        let data = {"showNutritionValue":document.getElementById("optionsInput").checked}
        xhr.setRequestHeader("Authorization", getCookie("jwt"))
        xhr.setRequestHeader("Content-Type", "application/json")
        xhr.send(JSON.stringify(data))
    })

    document.getElementById("passwordFormButton").addEventListener("click", function(event) {
        event.preventDefault();
        let pw = document.getElementById("password");
        let cPW = document.getElementById("confirm_password")
        if (!document.getElementById("password").checkValidity() || pw.value !== cPW.value) {
            document.getElementById("password").reportValidity();
            return;
        }
        let xhr = new XMLHttpRequest();
        xhr.onload = function() {
            window.location.reload();
        }
        xhr.open("PATCH", "/user/"+getCookie("userID")+"/imp")
        let data = {"password":document.getElementById("password").value}
        xhr.setRequestHeader("Authorization", getCookie("jwt"))
        xhr.setRequestHeader("Content-Type", "application/json")
        xhr.send(JSON.stringify(data))
    })
    document.getElementById("password").addEventListener('input', function (event) {
        let input = event.target;
        let inputValue = event.target.value;
        if (inputValue.length < 8) {
            input.setCustomValidity(`The password must be at least 8 character`);
        }else if (!/[A-Z]/.test(inputValue)) {
            input.setCustomValidity(`The password must include at least one upper case letter`);
        }else if (!/[a-z]/.test(inputValue)) {
            input.setCustomValidity(`The password must include at least one lower case letter`);
        }else if (!/[0-9]/.test(inputValue)) {
            input.setCustomValidity(`The password must include at least one number`);
        }else if (!/[^a-zA-Z0-9]/.test(inputValue)) {
            input.setCustomValidity(`The password must include one special character.`)
        }else if (inputValue === "") {
            input.setCustomValidity("Please fill out this field")
        }else {
            input.setCustomValidity("")
            checkPasswords()
        }
        input.reportValidity();
    });
    document.getElementById("password").addEventListener('invalid', function (event) {
        let input = event.target
        if (input.value === "") {
            input.setCustomValidity("Please fill out this field");
        }
    });

    document.getElementById("confirm_password").addEventListener('input', function (event) {
        let input = event.target;
        if (!checkPasswords()) {
            input.setCustomValidity("The passwords dont match");
        }else {
            input.setCustomValidity("")
        }
        input.reportValidity();
    })
    document.getElementById("confirm_password").addEventListener('invalid', function (event) {
        let input = event.target;
        if (input.value === "") {
            input.setCustomValidity("Please fill out this field");
        }
    });

    document.getElementById("emailFormButton").addEventListener("click", function(event) {
        event.preventDefault();
        if (!document.getElementById("email").checkValidity()) {
            document.getElementById("password").reportValidity();
            return;
        }
        let xhr = new XMLHttpRequest();
        xhr.onload = function() {
            window.location.reload();
        }
        xhr.open("PATCH", "/user/"+getCookie("userID")+"/imp")
        let data = {"email":document.getElementById("email").value}
        xhr.setRequestHeader("Authorization", getCookie("jwt"))
        xhr.setRequestHeader("Content-Type", "application/json")
        xhr.send(JSON.stringify(data))
    })

    document.getElementById("email").addEventListener('input', function (event) {
        let input = event.target;
        let inputValue = event.target.value;
        input.checkValidity();
        if (!inputValue.includes("@")) {
            input.setCustomValidity(`The email address must include an @-sign. The statement "${event.target.value}" is missing an @-sign`);
        }else if (!inputValue.slice(inputValue.indexOf("@")+1).includes(".")) {
            input.setCustomValidity(`The email address must include a "." symbol. The statement "${inputValue.slice(inputValue.indexOf("@")+1)}" is missing an "." symbol.`);
        }else if (inputValue === "") {
            input.setCustomValidity("Please fill out this field");
        }else if (inputValue.slice(inputValue.indexOf("@")+1).endsWith(".")) {
            input.setCustomValidity(`The "." in "${inputValue.slice(inputValue.indexOf("@")+1)}" is in the wrong place`);
        }else {
            input.setCustomValidity("");
        }
        input.reportValidity();
    })
    document.getElementById("email").addEventListener('invalid', function (event) {
        let input = event.target;
        if (input.value === "") {
            input.setCustomValidity("Please fill out this field");
        }
    });

})

