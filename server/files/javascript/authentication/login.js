
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

window.onload = function () {
    let form = {
        "username":"text",
        "password":"password"
    }
    new FormBuilder(form, "Login", "Log in", {}).appendTo(document.getElementById("loginForm"));

    document.getElementById("submitID").addEventListener("submit", function (event) {
        //implement send request to endpoint
        event.preventDefault();
        let data = getDataFromForm();
        throw new Error("not implemented")
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
}
