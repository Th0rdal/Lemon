import Builder from "./Builder.js"

export class FormBuilder  extends Builder {
    constructor(formObject, title, buttonValue, prefillValue, options) {
        super("form");
        if (options["baseID"] === undefined) {
            options["baseID"] = "form"
        }
        super.configureBaseElement("", options["baseID"], "")
        this.element.appendChild(
            //super.createParagraph([], "formTitle", "", title)
            super.createElement("p", {"class":"formTitle", "textContent": title})
        );
        for (let line in formObject) {
            if (!prefillValue.hasOwnProperty(line)) {
                    prefillValue[line] = "";
            }
            super.addChildren([
            /*super.createParagraph([
                super.createLabel(line, "standardFont", "", line),
                super.createInput(formObject[line], "standardFont", line, line, prefillValue[line], true)
            ], "authenticationFormElement")*/
            super.createElement("p", {
                "class":"authenticationFormElement",
                "id":line+"Paragraph",
                "children": [
                    super.createElement("label", {"class":"standardFont", "for":line, "textContent":line}),
                    super.createElement("input", {"class":"standardFont", "id":line, "name":line, "type":formObject[line], "placeholder":prefillValue[line],  "required":true})
                ]
            })
            ]);
        }
        this.element.appendChild(
            /*super.createParagraph([
            super.createInput("submit", "", "submitID", "", buttonValue)
        ], "authenticationFormElement")*/
            super.createElement("p", {
                "class":"authenticationFormElement",
                "id": "buttons",
                "children": [
                    super.createElement("input", {"id":"submitID", "type": "submit", "value":buttonValue})
                ]
            })
        )
    }
}

function test() {
    let form = {
        "username":"text",
        "password":"password"
    }
    new FormBuilder(form, "Login", "Log in", {}).appendTo(document.getElementById("body"));
}
