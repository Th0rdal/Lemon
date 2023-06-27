import {FormBuilder} from "../builder/FormBuilder.js";


function getDataFromForm() {
    let data = {}
    let inputElements = document.getElementById("loginForm").querySelectorAll("input");
    inputElements.forEach(function(input) {
      if (input.type !== "submit") {
          data[input.id] = input.value;
      }
    })
    return data;
}

window.onload = function () {
    let form = {
        "username":"text",
        "password":"password"
    }
    new FormBuilder(form, "Login", "Log in", {}, {"baseID":"loginForm"}).appendTo(document.getElementById("loginForm"));
    let tag = document.createElement("input");
    tag.id = "registerID";
    tag.type = "submit";
    tag.value = "Register";

    document.getElementById("buttons").appendChild(tag);
    document.getElementById("loginFormButton").addEventListener("click", function (event) {
        event.preventDefault();
        let data = getDataFromForm();
        if (!document.getElementById("username").checkValidity()) {
            document.getElementById("username").reportValidity();
            return;
        }else if (!document.getElementById("password").checkValidity()) {
            document.getElementById("password").reportValidity();
            return;
        }
        let xhr = new XMLHttpRequest();
        xhr.onload = function() {
            let response = JSON.parse(xhr.responseText);
            if (xhr.status === 200) {
                let expirationDate = new Date();
                expirationDate.setTime(expirationDate.getTime() + (Number(response.expiresIn) * 60 * 1000))
                document.cookie = "jwt=" + response["token"] + ";path=/;expires="+expirationDate.toUTCString();
                document.cookie = "username=" + data["username"] + ";path=/;expires="+expirationDate.toUTCString();
                document.cookie = "userID=" + response["userID"] + ";path=/;expires="+expirationDate.toUTCString();
                window.location.href = "/";
            }else {
                console.log(response);
            }

        }
        xhr.open("POST", "/login");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(data));
    })

    document.getElementById("username").addEventListener('input', function (event) {
        let input = event.target;
        if (input.value !== "") {
            input.setCustomValidity("");
        }
    });
    document.getElementById("username").addEventListener('invalid', function (event) {
        let input = event.target;
        if (input.value === "") {
            input.setCustomValidity("Please fill out this field");
        }else {
            input.setCustomValidity("");
        }
    });

    document.getElementById("password").addEventListener('input', function (event) {
        let input = event.target;
        if (input.value !== "") {
            input.setCustomValidity("");
        }
    });
    document.getElementById("password").addEventListener('invalid', function (event) {
        let input = event.target;
        if (input.value === "") {
            input.setCustomValidity("Please fill out this field");
        }else {
            input.setCustomValidity("");
        }
    });

    document.getElementById("registerID").addEventListener("click", function(event) {
        window.location.href = "/user/register.html";
    })
}
