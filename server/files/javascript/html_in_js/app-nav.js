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
                        <a href="/user/userPage" hidden id="user">user</a>
                    </div>
                </nav>
            `
    }
}

customElements.define("app-nav", AppNav);

function isExpired(jwt) {
    const payload = JSON.parse(atob(jwt));
    const expirationTimeStamp = payload.exp;
    const expirationDate = new Date(expirationTimeStamp * 1000);
    const currentDate = new Date();
    return expirationDate < currentDate;

}

function logout() {
    deleteCookie("jwt");
   deleteCookie("username");
   deleteCookie("userID");
}

window.addEventListener("load", function() {
    let jwtCookie = getCookie("jwt")
    if (jwtCookie !== null) {
        if (isExpired(jwtCookie)) {
            logout();
            return;
        }
        document.getElementById("loginAnchor").textContent = "Logout";
        document.getElementById("user").style.display = "block";
        document.getElementById("loginAnchor").onclick = logout;
        document.getElementById("loginAnchor").href = "/";
    }
})

