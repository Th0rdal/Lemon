//import {RecipeCoverBuilder} from "../builder/RecipeCoverBuilder";

import {getCookie} from "../tools/cookies.js";
import {commentBuilder} from "../builder/commentBuilder.js";

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
        user.href = "https://example.com/profile/" + data.creatorID; // Hier den Link zur Benutzerprofilseite einfügen
        articleElement.appendChild(user);


        // Bewertung
        let ratingElement = document.createElement('p');
        ratingElement.textContent = "Rating: " + data.ratingStars + " stars (" + data.ratingAmount + " ratings)";
        articleElement.appendChild(ratingElement);


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
        button.addEventListener("click", function() {
            let xhr = new XMLHttpRequest();
            xhr.open("POST", "/recipe/" + recipeID + "/comment")
            let comment = document.getElementById("textBox").value;
            let data = {"creatorID":getCookie("userID"), "comment":comment}
            xhr.setRequestHeader("Authorization", getCookie("jwt"))
            xhr.setRequestHeader("Content-Type", "application/json")
            xhr.send(JSON.stringify(data))
        })
        bodyElement.append(button)

        let xhr = new XMLHttpRequest();
        xhr.onload = function() {
            console.log(JSON.parse(xhr.responseText))
            for (let comment of JSON.parse(xhr.responseText)) {
                if (comment.creatorID === getCookie("userID")) {
                    new commentBuilder(comment, true).appendTo(bodyElement)
                    continue;
                }
                new commentBuilder(comment, false).appendTo(bodyElement)
            }
        }
        xhr.open("GET", "/recipe/"+recipeID+"/comments")
        xhr.send()

    })
    .catch(error => {
        console.error(error);
        // Behandle den Fehler
    });


