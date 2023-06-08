import {getCookie} from "./cookies.js";

function deleteLine(label) {
    label.remove();
}

let ingredientsCounter = 0;
let stepsCounter = 1;
let tags;
let tags_save;

function getFormData() {
    let data = {
        "difficulty":document.getElementById("dropdown-button").textContent,
        "ratingStars":0,
        "ratingAmount":0,
        "comments":0,
        "nutrition":[],
        "image":"NONE",
        "method":[],
        "ingredients":[],
        "tags":[],
        "creatorID":getCookie("userID")
    }
    let form = document.getElementById("createRecipeForm");
    for (let div of form.querySelectorAll("input")) {
        console.log(div)
        if (div.id === "title" || div.id === "timeToMake") {
            data[div.id] = div.value;
        }
        if (div.id === "method" || div.id === "ingredients") {
            data[div.id].push(div.value);
        }
        if (div.id === "tagsInput") {
            for (let span of document.getElementById("chosenTags").querySelectorAll("span")) {
                data["tags"].push(span.textContent.slice(0, -2).trim());
            }
        }
    }
    return data;
}

function ingredientsBuilder() {
    const label = document.createElement("label");
    label.setAttribute("for", "label" + ingredientsCounter.toString())
    label.id = "label" + ingredientsCounter.toString();
    label.classList.add("ingredientLabels");

    const input = document.createElement("input");
    input.id = "ingredients";
    input.type = "text";
    input.required = true;
    input.placeholder = "Please enter your ingredient here";
    input.addEventListener("input", function(event) {
        if (event.target.value !== "") {
            event.target.setCustomValidity("")
        }
    })
    input.addEventListener("invalid", function(event) {
        if (event.target.value === "") {
            event.target.setCustomValidity("Please add at least one ingredient to your recipe");
        }
    })
    label.appendChild(input);

    const anchor = document.createElement("a");
    anchor.href = '#';
    anchor.id = "delete";
    anchor.classList.add("delete");
    anchor.textContent = "-";
    label.appendChild(anchor);
    anchor.addEventListener("click", function(event) {
        event.target.parentNode.label.remove();
    })

    ingredientsCounter++;

    document.getElementById("ingredientsInputDiv").appendChild(label);

    return label;
}

function methodBuilder() {
    const label = document.createElement("label");
    label.setAttribute("for", "label" + ingredientsCounter.toString())
    label.id = "label" + ingredientsCounter.toString();
    label.classList.add("ingredientLabels");

    const span = document.createElement("span");
    span.textContent = "step " + stepsCounter.toString();
    label.appendChild(span)

    const input = document.createElement("input");
    input.id = "method";
    input.type = "text";
    input.required = true;
    input.placeholder = "Please enter your step here";
    input.addEventListener("input", function(event) {
        if (event.target.value !== "") {
            event.target.setCustomValidity("");
        }
    })
    input.addEventListener("invalid", function(event) {
        if (event.target.value === "") {
            event.target.setCustomValidity("Please add at least one step to your recipe");
        }
    })
    label.appendChild(input);

    const anchor = document.createElement("a");
    anchor.href = '#';
    anchor.id = "delete";
    anchor.classList.add("delete");
    anchor.textContent = "-";
    label.appendChild(anchor);
    anchor.addEventListener("click", function(event) {
        event.target.parentNode.label.remove();
    })

    stepsCounter++;

    document.getElementById("methodInputDiv").appendChild(label);

    return label;
}

function createAnchor(tag) {
    let a = document.createElement("a");
    a.href = "#";
    a.textContent = tag;
    a.addEventListener("click", function(event) {
        let span = document.createElement("span");
        span.textContent = event.target.textContent + ", ";
        tags.splice(tags.indexOf(event.target.textContent), 1);
        addTagDropdown()
        span.addEventListener("click", function(event) {
            tags.push(event.target.textContent.slice(0, -2).trim())
            addTagDropdown();
            event.target.remove();
        })
        span.addEventListener("mouseenter", function(event) {
            event.target.style.cursor = "pointer";
        })
        span.addEventListener("mouseleave", function(event) {
            event.target.style.cursor = "none";
        })
        document.getElementById("chosenTags").appendChild(span);
    })
    return a;
}

function addTagDropdown() {
    let div = document.getElementById("dropdown-content-tag")
    if (div !== null) {
        div.remove();
    }
    div = document.createElement("div");
    div.classList.add("dropdown-content")
    div.id = "dropdown-content-tag";
    tags.sort();
    for (let index in tags) {
        div.appendChild(createAnchor(tags[index]));
    }
    document.getElementById("tags").appendChild(div);
}

window.onload = function() {

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

    document.getElementById("ingredientsAdd").addEventListener("click", function() {
        ingredientsBuilder();
    })

    document.getElementById("methodDiv").addEventListener("click", function() {
        methodBuilder();
    })

    document.getElementById("tagsInput").addEventListener("click", function(event) {
        document.getElementById("dropdown-content-tag").style.display = "block";
    })
    document.getElementById("tags").addEventListener("mouseleave", function(event) {
        document.getElementById("dropdown-content-tag").style.display = "none";
    })

    ingredientsBuilder();
    methodBuilder();

    const dropdownContent = document.querySelector('.dropdown-content');
    for (let anchor of dropdownContent.children) {
        anchor.addEventListener("click", function(event) {
            document.getElementById("dropdown-button").textContent = event.target.textContent;
            document.getElementById("dropdown-content").style.display = "none";
        })
    }

    document.getElementById("dropdown").addEventListener("mouseenter", function() {
        document.getElementById("dropdown-content").style.display = "block";
    })
    document.getElementById("dropdown").addEventListener("mouseleave", function() {
        document.getElementById("dropdown-content").style.display = "none";
    })

    document.getElementById("submitButton").addEventListener("click", function() {
        for (let input of document.getElementById("ingredientsInputDiv").querySelectorAll("input")) {
            if (input.value === "" && document.getElementById("ingredientsInputDiv").querySelectorAll("input").length > 1) {
                input.parentElement.remove()
            }
        }
        let counter = 1;
        for (let input of document.getElementById("methodInputDiv").querySelectorAll("input")) {
            if (input.value === "" && document.getElementById("methodInputDiv").querySelectorAll("input").length > 1) {
                input.parentElement.remove()
            }else {
                let span = input.parentElement.querySelector("span");
                span.textContent = "span " + counter.toString();
                counter++;
            }
        }

        let button = document.getElementById("dropdown-button");
        if (button.textContent === "Enter difficulty") {
            button.setCustomValidity("Please choose a difficulty for the recipe");
        }else {
            button.setCustomValidity("");
        }
        if (!document.getElementById("createRecipeForm").checkValidity()) {
            document.getElementById("createRecipeForm").reportValidity()
        }

        let data = getFormData();
        let xhr = new XMLHttpRequest();
        xhr.onload = function() {
            console.log("DONE");
        }
        xhr.open("PUT", "/recipe")
        console.log(getCookie("jwt"))
        xhr.setRequestHeader("Authorization", getCookie("jwt"))
        xhr.setRequestHeader("Content-Type", "application/json")
        xhr.send(JSON.stringify(data));


    })

    document.getElementById("title").addEventListener("input", function(event) {
        if (event.target.value !== "") {
            event.target.setCustomValidity("");
        }
    })
    document.getElementById("title").addEventListener("invalid", function(event) {
        if (event.target.value === "") {
            event.target.setCustomValidity("Please add a title for your recipe");
        }
    })

    document.getElementById("timeToMake").addEventListener("input", function(event) {
        if (event.target.value !== "") {
            event.target.setCustomValidity("")
        }
    })
    document.getElementById("timeToMake").addEventListener("invalid", function(event) {
        if (event.target.value === "") {
            event.target.setCustomValidity("Please add how long it takes to cook the recipe");
        }
    })

    getFormData();
}

