//import {RecipeCoverBuilder} from "../builder/RecipeCoverBuilder";

let recipeID = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
//const userID = window.location.href.substring(window.location.href.lastIndexOf("/") + 1)


// let test = "YGzgKCZRDcjY2Z0n"

fetch('/recipe/configure/' + recipeID)
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Fehler beim Abrufen des zufälligen Gerichts');
        }
    })
    .then(async data => {
        console.log('1')
        const bodyElement = document.querySelector("main")
        let articleElement = document.createElement("article");

        console.log('2')
        //Name of recipe
        let nameTitle = document.createElement('h1');
        nameTitle.textContent = data.title;
        articleElement.appendChild(nameTitle)

        console.log('3')
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

        console.log('4')
        //Ingredients of recipe
        let ingredients = document.createElement('h2');
        ingredients.textContent = "Zubereitung";

        let ingredientsUL = document.createElement('ul');
        Object.keys(data.ingredients).forEach(key => {
            let ingredientsLI = document.createElement('li');
            ingredientsLI.textContent = key + ': ' + data.ingredients[key];
            ingredientsUL.appendChild(ingredientsLI);
        });

        articleElement.appendChild(ingredients);
        articleElement.appendChild(ingredientsUL);

        console.log('5')
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


        bodyElement.append(articleElement);
    })
    .catch(error => {
        console.error(error);
        // Behandle den Fehler
    });


// window.location.hrefsubstring(window.href.lastIndexOf('/'))