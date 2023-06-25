import Builder from "./Builder.js"

export class RecipeCoverBuilder extends Builder{
    constructor(recipe) {
        super("article");
        this.element.appendChild(
            //super.createParagraph([super.createImage(recipe.image, "recipeImage")], "imageWrapper")
            super.createElement("p", {
                "class": "imageWrapper",
                "children": [super.createElement("img", {"class": "recipeImage", "src": recipe.image})]
            })
        );
        this.element.appendChild(
            //super.createHeadline(recipe.title, "recipeTitle")
            super.createElement("h1", {"class": "recipeTitle", "textContent": recipe.title})
        );


        //Todo
        this.element.appendChild(
            super.createElement("a", {
            "href": "recepies.html",
            "textContent": "Details"})
        )



        this.element.appendChild(
            /*super.createParagraph([
                super.createFontAwesomeIcon("fa-star", "ratingStar"),
                super.createSpan(super.createRatingString(recipe))
            ], "rating")*/
            super.createElement("p", {
                "class": "rating",
                "children": [
                    super.createElement("i", {"class": ["fas", "fa-star"], "id": "ratingStar"}),
                    super.createElement("span", {"textContent": super.createRatingString(recipe)})
                ]
            })
        );


        this.element.appendChild(
            /*super.createParagraph([
                super.createFontAwesomeIcon("fa-clock", "clock"),
                super.createSpan(recipe.timeToMake.toString() + " minutes", "time"),
                super.createFontAwesomeIcon("fa-chart-bar"),
                super.createSpan(recipe.difficulty.toString(), "difficulty")
            ], "additionalInfo")*/
            super.createElement("p", {
                "class": "additionalInfo",
                "children": [
                    super.createElement("i", {"class": ["fas", "fa-clock"], "id": "clock"}),
                    super.createElement("span", {
                        "textContent": recipe.timeToMake.toString() + " minutes",
                        "class": "time"
                    }),
                    super.createElement("i", {"class": ["fas", "fa-chart-bar"]}),
                    super.createElement("span", {"textContent": recipe.difficulty.toString(), "class": "difficulty"})

                ]
            })
        )
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
    new RecipeCoverBuilder(recipeOfTheDay).appendTo(document.getElementById("body"));
}