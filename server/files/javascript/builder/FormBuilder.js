const Builder = require('./builder')

export class FormBuilder  extends Builder {
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
            super.createInput("submit", "", "submitID", "", buttonValue)
        ], "authenticationFormElement"))

    }
}
