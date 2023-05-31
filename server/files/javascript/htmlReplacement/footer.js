
class Footer extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <footer>
                footer:
                test 2
            </footer>`
    }
}
customElements.define("app-footer", Footer)