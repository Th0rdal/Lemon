

export default class Builder {

    constructor(tag) {
        this.element = document.createElement(tag) ;
    }

    configureBaseElement(clazz="", id="", name="") {
        if (clazz) this.element.classList.add(clazz);
        if (id) this.element.id = id;
        if (name) this.element.name = name;
    }
    createRatingString(recipe) {
        return recipe.ratingStars.toString() + "/5 (" + recipe.ratingAmount.toString() + ")";
    }

    createParagraph(children, clazz="", id="", textContent="") {
        const p = document.createElement("p");
        if (clazz) p.classList.add(clazz);
        if (id) p.id = id;
        if (textContent) p.textContent = textContent;
        for (let child of children) {
            p.appendChild(child);
        }
        return p;
    }

    createElement(tag, configObject) {
        /*
        expected configObject values:
        class, id, name, textContent, for, value, required, type, src, placeholder, children (array)
         */
        const element = document.createElement(tag)
        if (configObject.hasOwnProperty("class")) {
            if (Array.isArray(configObject["class"])) {
                for (let clazz of configObject["class"]) {
                    element.classList.add(clazz);
                }
            }else {
                element.classList.add(configObject["class"]);
            }

        }
        if (configObject.hasOwnProperty("id")) element.id = configObject["id"];
        if (configObject.hasOwnProperty("name")) element.name = configObject["name"];
        if (configObject.hasOwnProperty("textContent")) element.textContent = configObject["textContent"];
        if (configObject.hasOwnProperty("for")) element.setAttribute = configObject["for"];
        if (configObject.hasOwnProperty("value")) element.value = configObject["value"];
        if (configObject.hasOwnProperty("required")) element.required = configObject["required"];
        if (configObject.hasOwnProperty("type")) element.type = configObject["type"];
        if (configObject.hasOwnProperty("src")) element.src = configObject["src"];
        if (configObject.hasOwnProperty("placeholder")) element.placeholder = configObject["placeholder"]
        if (configObject.hasOwnProperty("children")) {
            for (let child of configObject["children"]) {
                element.appendChild(child);
            }
        }
        return element;
    }

    appendTo(parent) {
        parent.appendChild(this.element);
    }

    addChildren(children) {
        for (let child of children) {
            this.element.appendChild(child);
        }
    }
}

function test() {
    let recipeOfTheDay = {
    "title": "recipeOfTheDay",
    "method": ["step1", "step2", "step3"],
    "ingredients": {
        "ingredient1": 2,
        "ingredient2": 4.5,
        "ingredient3": 5},
    "creatorID": "asdf",
    "nutrition": {
        "vitamin1": 5,
        "vitamin2": 5.5,
        "vitamin3": 46,
        "vitamin4": 3.3},
    "tags": ["vegan", "easy"],
    "ratingStars": 5.5,
    "ratingAmount": 500,
    "comments": 20,
    "timeToMake":25,
    "image":"../../resources/img/anonymFood.jpg",
    "difficulty":"medium"
    }
    //new RecipeCoverBuilder(recipeOfTheDay).appendTo(document.getElementById("body"));
    let form = {
        "username":"text",
        "password":"password"
    }
    //new FormBuilder(form, "Login", "Log in", {}).appendTo(document.getElementById("test"))
}
