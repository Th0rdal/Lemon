
class AppFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <footer>
                <p>Written by Lukas and Patrick</p>
                <p>
                  Contact us <a href="mailto:WebProjectLemon@gmail.com">here</a>
                </p>
            </footer>
        `
    }
}
customElements.define("app-footer", AppFooter)