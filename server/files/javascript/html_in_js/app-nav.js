
class AppNav extends HTMLElement {
    connectedCallback() {
        this.innerHTML =
            `
                <nav>
                    <div id="navigation" class="linkContainer">
                        <a href="../index.html">Home</a>
                        <a href="../user.html">User</a>
                        <a href="">Irgendwas</a>
                    </div>
                </nav>
            `
    }
}
customElements.define("app-nav", AppNav);