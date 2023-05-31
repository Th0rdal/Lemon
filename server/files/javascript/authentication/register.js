
function checkData() {
    const form = document.getElementById("registerForm");
    let data = {};
    for (let element of form) {
        if (element.tagName === "INPUT") {
            const label = form.querySelector('label[for="' + element.id + '"]');
            data[label.textContent] = element.value;
        }
    }
    console.log(data);
}
function register() {
    checkData();
    //Do authentication logic. send request
}

window.onload = function () {
    console.log("THERE")
    document.getElementById("registerButton").onclick = register;
}
