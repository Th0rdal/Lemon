//import {RecipeCoverBuilder} from "../builder/RecipeCoverBuilder";

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
        var imageElement = document.createElement('img');
        imageElement.src = data.image;
        articleElement.appendChild(imageElement);


        //Name of recipe
        let nameTitle = document.createElement('h1');
        nameTitle.textContent = data.title;
        articleElement.appendChild(nameTitle)


        // Bewertung
        var ratingElement = document.createElement('p');
        ratingElement.textContent = "Rating: " + data.ratingStars + " stars (" + data.ratingAmount + " ratings)";
        articleElement.appendChild(ratingElement);


        // Schwierigkeit
        var difficultyElement = document.createElement('p');
        difficultyElement.textContent = "Difficulty: " + data.difficulty;
        articleElement.appendChild(difficultyElement);


        // Nährwerte
        if (typeof data.nutrition === 'object' && Object.keys(data.nutrition).length > 0) {
            var nutrition = document.createElement('p');
            nutrition.textContent = "Nährwerte: ";

            var nutritionUL = document.createElement('ul');


            Object.keys(data.nutrition).forEach(key => {
                var nutritionLI = document.createElement('li');
                nutritionLI.textContent = key + ": " + data.nutrition[key];
                nutritionUL.appendChild(nutritionLI);
            });

            articleElement.appendChild(nutrition);
            articleElement.appendChild(nutritionUL);
        }


        //Zubereitungszeit
        var timeElement = document.createElement('p');
        timeElement.textContent = "Time to make: " + data.timeToMake + " minutes";
        articleElement.appendChild(timeElement);


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


        //User
        let username = ""
        let response = await fetch(`http://localhost:3000/user/${data.creatorID}`)
        let body = await response.json();
        username = body.username
        console.log('6')
        let user = document.createElement('a');
        user.textContent = username;
        user.href = "https://example.com/profile/" + data.creatorID; // Hier den Link zur Benutzerprofilseite einfügen
        articleElement.appendChild(user);


        // Kommentar
        var commentsElement = document.createElement('p');
        commentsElement.textContent = "Comments: " + data.comments;
        articleElement.appendChild(commentsElement);


        bodyElement.append(articleElement);
    })
    .catch(error => {
        console.error(error);
        // Behandle den Fehler
    });


