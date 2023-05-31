
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
    document.getElementById("registerForm").addEventListener("submit", function (event) {
        //implement send request to endpoint
        event.preventDefault();
        let data = getDataFromForm();
        throw new Error("not implemented")
    })
}
