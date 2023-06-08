
class AppNav extends HTMLElement {
    connectedCallback() {
        this.innerHTML =
            `
                <nav>
                    <div id="navigation" class="linkContainer">
                        <a href="/">Home</a>
                        <a href="/recipe/filter.html">Filter</a>
                        <a href="/user/login.html" id="loginAnchor">Login</a>
                    </div>
                </nav>
            `
    }
}

customElements.define("app-nav", AppNav);

window.addEventListener("load", function() {
    let cookies = document.cookie.split(";");
    document.onclick = function() {};
    for (let index in cookies) {
        if (cookies[index].trim().startsWith("jwt")) {
           document.getElementById("loginAnchor").textContent = "Logout";
           document.getElementById("loginAnchor").onclick = function () {
               document.cookie = "jwt=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
           }
           document.getElementById("loginAnchor").href = "/";
           return;
        }
    }

})

