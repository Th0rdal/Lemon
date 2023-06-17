import {getCookie, deleteCookie} from "http://localhost:3000/javascript/tools/cookies.js"

class AppNav extends HTMLElement {
    connectedCallback() {
        this.innerHTML =
            `
                <nav>
                    <div id="navigation" class="linkContainer">
                        <a href="/">Home</a>
                        <a href="/recipe/filter.html">Filter</a>
                        <a href="/user/login.html" id="loginAnchor">Login</a>
                        <a hidden id="user">user</a>
                    </div>
                </nav>
            `
    }
}

customElements.define("app-nav", AppNav);

window.addEventListener("load", function() {
    let jwtCookie = getCookie("jwt")
    if (jwtCookie !== null) {
        document.getElementById("loginAnchor").textContent = "Logout";
        document.getElementById("user").style.display = "block";
        document.getElementById("user").href = "/user/" + getCookie("userID")
        document.getElementById("loginAnchor").onclick = function () {
           deleteCookie("jwt");
           deleteCookie("username");
           deleteCookie("userID");
        }
        document.getElementById("loginAnchor").href = "/";
    }
})

