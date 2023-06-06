
class AppHeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML =
            `
                <header>
                    <p class="title">LEMON!</p>
                    <app-nav></app-nav>
                </header>
            `
    }
}
customElements.define("app-header", AppHeader)