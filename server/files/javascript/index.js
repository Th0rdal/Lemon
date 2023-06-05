import {RecipeCoverBuilder} from "./builder/RecipeCoverBuilder.js"

window.onload = function() {
    let xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (xhr.status === 200) {
            const body = JSON.parse(xhr.responseText)
            for (let index in body) {
                new RecipeCoverBuilder(body[index]).appendTo(document.getElementById("main"))
            }
        }
    }
    let url = "filter?amount=" + encodeURIComponent(25);
    xhr.open("GET", url);
    xhr.send();
}