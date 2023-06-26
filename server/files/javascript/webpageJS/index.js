import {RecipeCoverBuilder} from "../builder/RecipeCoverBuilder.js"



// fetch('/recipe/ofTheDay')
//     .then(response => {
//         if (response.ok) {
//             return response.json();
//         } else {
//             throw new Error('Fehler beim Abrufen des zufälligen Gerichts');
//         }
//     })
//     .then(data => {
//
//         new RecipeCoverBuilder(data).appendTo(document.getElementById("recipeCoverWrapper"));
//
//     })
//     .catch(error => {
//         console.error(error);
//         // Behandle den Fehler
//     });


window.onload = function() {
    let xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (xhr.status === 200) {
            const body = JSON.parse(xhr.responseText)
            console.log(body)
            new RecipeCoverBuilder(body, false).appendTo(document.getElementById("recipeCoverWrapper"))
        }
    }
    xhr.open("GET", "recipe/ofTheDay");
    xhr.send();
}
