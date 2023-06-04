const Builder = require('./Builder');

export class RecipeCoverBuilder extends Builder{
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