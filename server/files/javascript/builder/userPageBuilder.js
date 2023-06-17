import Builder from "./Builder.js"
import {FormBuilder} from "./FormBuilder.js"

export default class userPageBuilder extends Builder{
    constructor(updateAble, data) {
        super("form");
        super.configureBaseElement("", "registerForm", "")
        this.element.appendChild(
            super.createElement("p", {"class":"formTitle", textContent:"user Page:"})
        )
        this.element.appendChild(
            super.createElement("p", {
                "id":"usernameParagraph",
                "children": [
                    super.createElement("input", {
                        "class":"standardFont",
                        "id":"username",
                        "type":"text",
                        "placeholder": data["username"],
                        "required":true
                    })
                ]
            })
        )
        this.element.appendChild(
            super.createElement("p", {
                "id":"options",
                "children": [
                    super.createElement("label", {"for":"optionsInput", "textContent":"view nutritional values"}),
                    super.createElement("input", {"id":"optionsInput", "type":"checkbox"})
                ]
            })
        )
        let pwElement = super.createElement("div", {"id":"changePasswordParagraph"})
        this.element.appendChild(pwElement)
        let emailElement = super.createElement("div", {"id":"changeEmail"})
        this.element.appendChild(emailElement)
        new FormBuilder({"password":"password", "confirm_password":"password"}, "change password:", "update Password", {}, {"baseID":"passwordForm"}).appendTo(pwElement);
        new FormBuilder({"email":"text"}, "change email:", "update email", {"email":"testmail"}, {"baseID":"emailForm"}).appendTo(emailElement);

    }
}