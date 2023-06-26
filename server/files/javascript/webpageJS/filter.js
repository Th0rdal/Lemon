import {RecipeCoverBuilder} from "../builder/RecipeCoverBuilder.js";

function loadRecipes(xhr) {

    if (xhr.status === 200) {
        const body = JSON.parse(xhr.responseText)
        for (let index in body) {
            new RecipeCoverBuilder(body[index], false).appendTo(document.getElementById("recipeCoverWrapper"))
        }
    }
}

function clearRecipes() {
    for (let element of document.getElementById("recipeCoverWrapper").querySelectorAll("article")) {
        element.remove();
    }
}

function sendFilterRequest() {
    let xhr = new XMLHttpRequest();
    xhr.onload = function() {
        clearRecipes();
        loadRecipes(xhr);
    };
    xhr.open("GET", createFilterUrl());
    xhr.send();
}

function createFilterUrl() {
    let url = "/filter?amount=" + encodeURIComponent(25)
    if (document.getElementById("recipeTitle").value) {
        url = url+"&s=" + encodeURIComponent(document.getElementById("recipeTitle").value);
    }
    for (let element of document.getElementById("sidebar").querySelectorAll('input')) {
        if (element.checked) {
            url = url + "&i=" + element.value;
        }
    }
    return url;
}

window.onload = function() {
    let xhr = new XMLHttpRequest();
    xhr.onload = function() {
        loadRecipes(xhr);
    }

    let url = createFilterUrl("")
    xhr.open("GET", url);
    xhr.send();

    document.getElementById("recipeTitle").addEventListener('input', function() {
        sendFilterRequest();
    })

    for (let element of document.getElementById("sidebar").querySelectorAll("input")) {
        element.addEventListener('input', function() {
            sendFilterRequest();
        })
    }
}