import {FormBuilder} from "../builder/FormBuilder.js";

function getDataFromForm() {
    let data = {}
    let inputElements = document.getElementById("registerForm").querySelectorAll('input');
    inputElements.forEach(function(input) {
      if (input.type !== "submit") {
          data[input.id] = input.value;
      }
    })
    return data;
}

function checkPasswords() {
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirm_password");

    if (password.value !== confirmPassword.value || password.value === "") {
        document.getElementById("dot").style.color = "red";
        return false;
    }
    document.getElementById("dot").style.color = "green";
    return true;
}

window.onload = function () {
    let formData = {
        "username":"text",
        "email":"email",
        "password":"password",
        "confirm_password":"password"
    }
    let prefillValue = {
        "username":"Max Counterman",
        "email":"max@gmail.com",
    }
    new FormBuilder(formData, "Register", "Register", prefillValue, true).appendTo(document.getElementById("registerForm"));
    //document.getElementById("password").addEventListener("blur", checkPasswords);
    //document.getElementById("confirm_password").addEventListener("blur", checkPasswords);

    document.getElementById("username").addEventListener('input', function (event) {
        let input = event.target;
        let inputValue = event.target.value;
        if (inputValue.length < 3) {
            event.target.setCustomValidity("Username must be at least 3 character");
        }else if (inputValue.includes(".") || inputValue.includes("@")) {
            event.target.setCustomValidity('Username must not include "." or "@"');
        }else if (inputValue === "") {
            event.target.setCustomValidity("Please fill out this field");
        }else {
            event.target.setCustomValidity("");
        }
        input.reportValidity();
    })
    document.getElementById("username").addEventListener('invalid', function (event) {
        let target = event.target;
        if (target.value === "") {
            target.setCustomValidity("Please fill out this field");
        }
    });

    document.getElementById("email").addEventListener('input', function (event) {
        let input = event.target;
        let inputValue = event.target.value;
        input.checkValidity();
        if (!inputValue.includes("@")) {
            input.setCustomValidity(`The email address must include an @-sign. The statement "${event.target.value}" is missing an @-sign`);
        }else if (!inputValue.slice(inputValue.indexOf("@")+1).includes(".")) {
            input.setCustomValidity(`The email address must include a "." symbol. The statement "${inputValue.slice(inputValue.indexOf("@")+1)}" is missing an "." symbol.`);
        }else if (inputValue === "") {
            input.setCustomValidity("Please fill out this field");
        }else if (inputValue.slice(inputValue.indexOf("@")+1).endsWith(".")) {
            input.setCustomValidity(`The "." in "${inputValue.slice(inputValue.indexOf("@")+1)}" is in the wrong place`);
        }else {
            input.setCustomValidity("");
        }
        input.reportValidity();
    })
    document.getElementById("email").addEventListener('invalid', function (event) {
        let input = event.target;
        if (input.value === "") {
            input.setCustomValidity("Please fill out this field");
        }
    });

    document.getElementById("password").addEventListener('input', function (event) {
        let input = event.target;
        let inputValue = event.target.value;
        if (inputValue < 8) {
            input.setCustomValidity(`The password must be at least 8 character`);
        }else if (!/[A-Z]/.test(inputValue)) {
            input.setCustomValidity(`The password must include at least one upper case letter`);
        }else if (!/[a-z]/.test(inputValue)) {
            input.setCustomValidity(`The password must include at least one lower case letter`);
        }else if (!/[0-9]/.test(inputValue)) {
            input.setCustomValidity(`The password must include at least one number`);
        }else if (!/[^a-zA-Z0-9]/.test(inputValue)) {
            input.setCustomValidity(`The password must include one special character.`)
        }else if (inputValue === "") {
            input.setCustomValidity("Please fill out this field")
        }else {
            input.setCustomValidity("")
            checkPasswords()
        }
        input.reportValidity();
    });
    document.getElementById("password").addEventListener('invalid', function (event) {
        let input = event.target
        if (input.value === "") {
            input.setCustomValidity("Please fill out this field");
        }
    });

    document.getElementById("confirm_password").addEventListener('input', function (event) {
        let input = event.target;
        if (!checkPasswords()) {
            input.setCustomValidity("The passwords dont match");
        }else {
            input.setCustomValidity("")
        }
        input.reportValidity();
    })
    document.getElementById("confirm_password").addEventListener('invalid', function (event) {
        let input = event.target;
        if (input.value === "") {
            input.setCustomValidity("Please fill out this field");
        }
    });

    document.getElementById("submitID").addEventListener("click", function (event) {
        event.preventDefault();
        let data = getDataFromForm();
        let xhr = new XMLHttpRequest();
        xhr.onload = function() {
            window.location.href = "/";
        }
        xhr.open("POST", "/register");
        xhr.send(JSON.stringify(data));
    })
}