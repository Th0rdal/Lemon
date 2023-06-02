
class Builder {

    constructor(tag) {
        this.element = document.createElement(tag) ;
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

    createFontAwesomeIcon(type, id="") {
        const star = document.createElement("i");
        star.classList.add("fas", type);
        star.id = id;
        return star;
    }

    createImage(src, clazz="") {
        const img = document.createElement("img");
        img.classList.add(clazz);
        if (src !== "None") img.src = src;
        return img;
    }

    createHeadline(string, clazz="") {
        const h = document.createElement("h1");
        h.classList.add(clazz);
        h.textContent = string;
        return h;
    }

    createSpan(string, clazz="", id="") {
        const span = document.createElement("span");
        if (clazz) span.classList.add(clazz);
        if (id) span.id = id
        span.textContent = string;
        return span;
    }

    createLabel(textContent, clazz="", id="", f="") {
        const label = document.createElement("label");
        if (clazz) label.classList.add(clazz)
        if (id) label.id = id;
        if (f) label.setAttribute("for", f);
        label.textContent = textContent;
        return label;
    }

    createInput(type, clazz="", id="", name="", value="", required=false) {
        const input = document.createElement("input");
        input.type = type;
        if (clazz) input.classList.add(clazz);
        if (id) input.id = id;
        if (name) input.name = name;
        if (value) input.value = value;
        input.required = required;
        return input;
    }

    appendTo(parent) {
        console.log(parent)
        parent.appendChild(this.element);
    }

    addChildren(children) {
        for (let child of children) {
            this.element.appendChild(child);
        }
    }
}
class RecipeCoverBuilder extends Builder{
    constructor(recipe) {
        super("article");
        this.element.appendChild(
            super.createParagraph([super.createImage(recipe.image, "recipeImage")], "imageWrapper")
        );
        this.element.appendChild(
            super.createHeadline(recipe.title, "recipeTitle")
        );
        this.element.appendChild(
            super.createParagraph([
                super.createFontAwesomeIcon("fa-star", "ratingStar"),
                super.createSpan(super.createRatingString(recipe))
            ], "rating")
        );
        this.element.appendChild(
            super.createParagraph([
                super.createFontAwesomeIcon("fa-clock", "clock"),
                super.createSpan(recipe.timeToMake.toString() + " minutes", "time"),
                super.createFontAwesomeIcon("fa-chart-bar"),
                super.createSpan(recipe.difficulty.toString(), "difficulty")
            ], "additionalInfo")
        )
    }


}

class FormBuilder  extends Builder {
    constructor(formObject, title, buttonValue, prefillValue={}) {
        super("form");

        this.element.appendChild(super.createParagraph([], "formTitle", "", title));
        for (let line in formObject) {
            if (!prefillValue.hasOwnProperty(line)) {
                    prefillValue[line] = "";
            }
            super.addChildren([
            super.createParagraph([
                super.createLabel(line, "standardFont", "", line),
                super.createInput(formObject[line], "standardFont", line, line, prefillValue[line], true)
            ], "authenticationFormElement")]);
        }
        this.element.appendChild(super.createParagraph([
            super.createInput("submit", "", "", "", buttonValue)
        ], "authenticationFormElement"))

    }
}
window.onload = function () {
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
