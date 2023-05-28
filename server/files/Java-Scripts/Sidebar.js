function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("collapsed");
}

var button = document.getElementById("VegiButton");
var options = document.getElementById("VegiOptions");

button.addEventListener("click", function() {
    options.style.display = options.style.display === "none" ? "block" : "";
});