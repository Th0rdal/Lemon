
class RecipeCoverBuilder {
    constructor(recipe) {
        this.article = document.createElement("article");
        this.article.appendChild(
            this.createParagraph([this.createImage(recipe.image, "recipeImage")], "imageWrapper")
        );
        this.article.appendChild(
            this.createHeadline(recipe.title, "recipeTitle")
        );
        this.article.appendChild(
            this.createParagraph([
                this.createFontAwesomeIcon("fa-star", "ratingStar"),
                this.createSpan(this.createRatingString(recipe))
            ], "rating")
        );
        this.article.appendChild(
            this.createParagraph([
                this.createFontAwesomeIcon("fa-clock", "clock"),
                this.createSpan(recipe.timeToMake.toString() + " minutes", "time"),
                this.createFontAwesomeIcon("fa-chart-bar"),
                this.createSpan(recipe.difficulty.toString(), "difficulty")
            ], "additionalInfo")
        )
    }

    createRatingString(recipe) {
        return recipe.ratingStars.toString() + "/5 (" + recipe.ratingAmount.toString() + ")";
    }

    createParagraph(children, clazz="", id="") {
        const p = document.createElement("p");
        if (clazz) p.classList.add(clazz);
        if (id) p.id = id;
        for (let element of children) {
            p.appendChild(element);
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

    appendTo(parent) {
        parent.appendChild(this.article);
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
    new RecipeCoverBuilder(recipeOfTheDay).appendTo(document.getElementById("body"));

}
