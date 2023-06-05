
class AppNav extends HTMLElement {
    connectedCallback() {
        this.innerHTML =
            `
                <nav>
                    <div id="navigation" class="linkContainer">
                        <a href="/">Home</a>
                        <a href="/user/user.html">User</a>
                        <a href="/recipe/filter.html">Filter</a>
                    </div>
                </nav>
            `
    }
}
customElements.define("app-nav", AppNav);