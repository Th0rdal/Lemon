import {RecipeCoverBuilder} from "../builder/RecipeCoverBuilder.js"



fetch('/recipe/ofTheDay')
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Fehler beim Abrufen des zufälligen Gerichts');
        }
    })
    .then(data => {

        new RecipeCoverBuilder(data).appendTo(document.getElementById("recipeCoverWrapper"));

    })
    .catch(error => {
        console.error(error);
        // Behandle den Fehler
    });


// window.onload = function() {
//     let xhr = new XMLHttpRequest();
//     xhr.onload = function() {
//         if (xhr.status === 200) {
//             const body = JSON.parse(xhr.responseText)
//             for (let index in body) {
//                 new RecipeCoverBuilder(body[index]).appendTo(document.getElementById("recipeCoverWrapper"))
//             }
//         }
//     }
//     let url = "filter?amount=" + encodeURIComponent(25);
//     xhr.open("GET", url);
//     xhr.send();
// }
