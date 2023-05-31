function toggleSidebar() {

    const sidebar = document.getElementById("sidebar");
    const button = document.getElementById("sidebar-button");
    sidebar.classList.toggle("collapsed");


}
function toggleCheckboxes(optionId) {
    var checkboxList = document.getElementById(optionId).querySelector("div[id$='CheckboxList']");
    checkboxList.style.display = checkboxList.style.display === "none" ? "block" : "none";
}