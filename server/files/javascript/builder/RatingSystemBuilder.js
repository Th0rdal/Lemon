import Builder from "./Builder.js"
import {getCookie} from "../tools/cookies.js";

export class RatingSystemBuilder extends Builder {

    constructor(starAmount, recipeID, creatorID) {
        super("div");
        super.configureBaseElement("rating");
        for (let i = 0; i < starAmount*2; i++) {
            let tempElement = super.createElement("input", {
                type:"radio",
                name:"star_"+Number(starAmount*2 - i),
                required:false
            })
            tempElement.addEventListener("click", function(event) {
                let xhr = new XMLHttpRequest();
                xhr.onload = function() {
                    window.location.reload();
                }
                xhr.open("PUT", "/recipe/" + recipeID + "/rating")
                xhr.setRequestHeader("Authorization", getCookie("jwt"))
                xhr.setRequestHeader("Content-Type", "application/json")
                let rating = event.target.name.substring(event.target.name.lastIndexOf("_")+1)
                let data = {"creatorID":creatorID, "ratingStar":Number(rating)/2}
                xhr.send(JSON.stringify(data))
            })
            this.element.appendChild(tempElement)
        }
    }
}

function test() {
    new RatingSystemBuilder(5).appendTo(document.getElementById("body"));
}