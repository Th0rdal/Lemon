

window.onload = function() {
    document.getElementById("formTitle").textContent = "update your recipe";

    let xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (xhr.status === 200) {
            let data = JSON.parse(xhr.responseText)
            tags = data["tags"]
            tags_save = tags;
            addTagDropdown();
        }
    }
    xhr.open("GET", "/recipe/tags");
    xhr.send();
}