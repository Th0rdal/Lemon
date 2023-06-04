import Builder from "./Builder.js"

class RatingSystemBuilder extends Builder {

    constructor(starAmount) {
        super("div");
        super.configureBaseElement("rating");
        for (let i = 0; i < starAmount*2; i++) {
            this.element.appendChild(
                super.createElement("input", {type:"radio", name:"star", required:false})
            )
        }
    }
}

function test() {
    new RatingSystemBuilder(5).appendTo(document.getElementById("body"));
}