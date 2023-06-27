//import {RecipeCoverBuilder} from "../builder/RecipeCoverBuilder";

import {getCookie} from "../tools/cookies.js";
import {commentBuilder} from "../builder/commentBuilder.js";
import {RatingSystemBuilder} from "../builder/RatingSystemBuilder.js";

let recipeID = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);


fetch('/recipe/configure/' + recipeID)
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Fehler beim Abrufen des zufälligen Gerichts');
        }
    })
    .then(async data => {

        const bodyElement = document.querySelector("main")
        let articleElement = document.createElement("article");


        //Bild
        let imageElement = document.createElement('img');
        imageElement.src = "/resources/img/"+data.image;
        articleElement.appendChild(imageElement);


        //Name of recipe
        let nameTitle = document.createElement('h1');
        nameTitle.textContent = data.title;
        articleElement.appendChild(nameTitle)

        //User
        let username = ""
        let response = await fetch(`http://localhost:3000/user/${data.creatorID}`)
        let body = await response.json();
        username = body.username

        let user = document.createElement('a');
        user.textContent = username;
        user.href = "/user/userPage/" + data.creatorID; // Hier den Link zur Benutzerprofilseite einfügen
        articleElement.appendChild(user);


        // Bewertung
        let ratingElement = document.createElement('p');
        ratingElement.textContent = "Rating: " + data.ratingStars + " stars (" + data.ratingAmount + " ratings)";
        articleElement.appendChild(ratingElement);

        new RatingSystemBuilder(5, data._id, getCookie("userID")).appendTo(articleElement)

        // Schwierigkeit
        let difficultyElement = document.createElement('p');
        difficultyElement.textContent = "Difficulty: " + data.difficulty;
        articleElement.appendChild(difficultyElement);

        //Zubereitungszeit
        let timeElement = document.createElement('p');
        timeElement.textContent = "Time to make: " + data.timeToMake + " minutes";
        articleElement.appendChild(timeElement);

        // Nährwerte
        if (typeof data.nutrition === 'object' && Object.keys(data.nutrition).length > 0) {
            let nutrition = document.createElement('p');
            nutrition.textContent = "Nährwerte: ";

            let nutritionUL = document.createElement('ul');


            Object.keys(data.nutrition).forEach(key => {
                let nutritionLI = document.createElement('li');
                nutritionLI.textContent = key + ": " + data.nutrition[key];
                nutritionUL.appendChild(nutritionLI);
            });

            articleElement.appendChild(nutrition);
            articleElement.appendChild(nutritionUL);
        }


        //Ingredients of recipe
        let ingredients = document.createElement('h2');
        ingredients.textContent = "Zutaten";

        let ingredientsUL = document.createElement('ul');
        Object.keys(data.ingredients).forEach(key => {
            let ingredientsLI = document.createElement('li');
            ingredientsLI.textContent = key + data.ingredients[key];
            ingredientsUL.appendChild(ingredientsLI);
        });
        articleElement.appendChild(ingredients);
        articleElement.appendChild(ingredientsUL);

        //Methoden of recipe
        let methodsHow = document.createElement('h2');
        methodsHow.textContent = "Zubereitung";

        let methodsHowUL = document.createElement('ul');
        for (let steps of data.method) {
            let methodsHowLI = document.createElement('li');
            methodsHowLI.textContent = steps;
            methodsHowUL.appendChild(methodsHowLI);
        }
        articleElement.appendChild(methodsHow);
        articleElement.appendChild(methodsHowUL);

        // Kommentar
        let commentsElement = document.createElement('p');
        commentsElement.textContent = "Comments: " + data.comments;
        articleElement.appendChild(commentsElement);


        bodyElement.append(articleElement);

        let textBox = document.createElement("textarea")
        textBox.rows = 5;
        textBox.id = "textBox"
        bodyElement.append(textBox)
        let button = document.createElement("input");
        button.value = "send comment";
        button.type = "submit"
        button.id = "textBoxInput"
        button.addEventListener("click", function() {
            let xhr = new XMLHttpRequest();
            xhr.open("POST", "/recipe/" + recipeID + "/comment")
            let comment = document.getElementById("textBox").value;
            let data = {"creatorID":getCookie("userID"), "comment":comment}
            xhr.setRequestHeader("Authorization", getCookie("jwt"))
            xhr.setRequestHeader("Content-Type", "application/json")
            xhr.send(JSON.stringify(data))
            window.location.reload()
        })
        bodyElement.append(button)

        let div = document.createElement("div")
        div.id = "commentDiv"
        let xhr = new XMLHttpRequest();
        xhr.onload = function() {
            for (let comment of JSON.parse(xhr.responseText)) {
                if (comment.creatorID === getCookie("userID")) {
                    new commentBuilder(comment, true).appendTo(div)
                    continue;
                }
                new commentBuilder(comment, false).appendTo(div)
            }
        }
        xhr.open("GET", "/recipe/"+recipeID+"/comments")
        xhr.send()
        bodyElement.appendChild(div)
    })
    .catch(error => {
        console.error(error);
        // Behandle den Fehler
    });


