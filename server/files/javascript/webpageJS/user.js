import userPageBuilder from "../builder/userPageBuilder.js"


document.addEventListener("DOMContentLoaded", function() {
    new userPageBuilder(false, {"username":"test"}).appendTo(document.getElementById("main"));
    //implement call api to get user data
})