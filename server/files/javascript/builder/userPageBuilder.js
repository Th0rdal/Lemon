import Builder from "./Builder.js"
import {FormBuilder} from "./FormBuilder.js"

export default class userPageBuilder extends Builder{
    constructor(updateAble, data) {
        super("form");
        super.configureBaseElement("", "userPageForm", "")
        this.element.appendChild(
            super.createElement("p", {"class":"formTitle", textContent:"user Page:"})
        )
        if (updateAble) {
            let tempElement = super.createElement("input", {
                    "id": "createRecipeButton",
                    "class":"saveOptions",
                    "type":"submit",
                    "value":"create Recipe"
                })
            tempElement.addEventListener("click", event => {
                event.preventDefault();
                window.location.href = "/recipe/createRecipe.html"
            })
            this.element.appendChild(
                super.createElement("p", {
                    "id":"usernameParagraph",
                    "children": [
                        super.createElement("input", {
                            "class":"standardFont",
                            "id":"username",
                            "type":"text",
                            "value": data["username"],
                            "required":true
                        })
                    ]
                })
            )
            this.element.appendChild(tempElement)
            this.element.appendChild(
                super.createElement("p", {
                    "id":"options",
                    "children": [
                        super.createElement("label", {"for":"optionsInput", "textContent":"view nutritional values"}),
                        super.createElement("input", {"id":"optionsInput", "type":"checkbox"})
                    ]
                })
            )
            this.element.appendChild(
                super.createElement("input", {"class":"saveOptions", "id":"saveOptions", "type":"submit", "value":"save options"})
            )
            let pwElement = super.createElement("div", {"id":"changePasswordParagraph"})
            this.element.appendChild(pwElement)
            let emailElement = super.createElement("div", {"id":"changeEmail"})
            this.element.appendChild(emailElement)
            new FormBuilder({"password":"password", "confirm_password":"password"}, "change password:", "update Password", {}, {"baseID":"passwordForm"}).appendTo(pwElement);
            new FormBuilder({"email":"text"}, "change email:", "update email", {"email":"testmail"}, {"baseID":"emailForm"}).appendTo(emailElement);
            this.element.appendChild(
                super.createElement("div", {"id":"recipeCoverWrapper"})
            )
        } else {
            this.element.appendChild(
                super.createElement("p", {
                    "id":"usernameParagraph",
                    "children": [
                        super.createElement("label", {
                            "class":"standardFont",
                            "id":"username",
                            "textContent":data["username"],
                            "type":"text",
                        })
                    ]
                })
            )
            this.element.appendChild(
                super.createElement("div", {"id":"recipeCoverWrapper"})
            )

        }

    }
}