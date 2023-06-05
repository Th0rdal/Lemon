
class Footer extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <footer>
                <p>Written by Lukas and Patrick</p>
                <p>
                  Contact us <a href="https://www.fh-campuswien.ac.at/">here</a>
                </p>
            </footer>
        `
    }
}
customElements.define("app-footer", Footer)