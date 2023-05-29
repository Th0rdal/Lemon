function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const button = document.getElementById("sidebar-button");
    sidebar.classList.toggle("collapsed");

    if (isCollapsed) {
        button.textContent = "Expand";
    } else {
        button.textContent = "Collapse";
    }

}
