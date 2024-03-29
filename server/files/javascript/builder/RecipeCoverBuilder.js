import Builder from "./Builder.js"

var link = 'recipe.html'

export class RecipeCoverBuilder extends Builder {
    constructor(recipe, configureAble) {
        super("article")
        this.element.onclick = function () {
            window.location.href = "/recipe/" + recipe["_id"];
        }
        this.element.appendChild(
            //super.createParagraph([super.createImage(recipe.image, "recipeImage")], "imageWrapper")
            super.createElement("p", {
                "class": "imageWrapper",
                "children": [super.createElement("img", {"class": "recipeImage", "src": "http://localhost:3000/resources/img/" + recipe.image})]
            })
        );
        this.element.appendChild(
            //super.createHeadline(recipe.title, "recipeTitle")
            super.createElement("h1", {"class": "recipeTitle", "textContent": recipe.title})
        );

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
            "ingredient3": 5
        },
        "creatorID": "asdf",
        "nutrition": {
            "vitamin1": 5,
            "vitamin2": 5.5,
            "vitamin3": 46,
            "vitamin4": 3.3
        },
        "tags": ["vegan", "easy"],
        "ratingStars": 5.5,
        "ratingAmount": 500,
        "comments": 20,
        "timeToMake": 25,
        "image": "../../resources/img/none.jpg",
        "difficulty": "medium"
    }
    new RecipeCoverBuilder(recipeOfTheDay, false).appendTo(document.getElementById("body"));
}