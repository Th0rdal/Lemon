

let body = {
    "username": "bot",
    "password": "1Password?"
};
let jwt;
fetch("http://localhost:3000/login", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify(body)
}).then(response => response.json())
    .then(response => {
        jwt = response["token"]
})

fetch("http://localhost:3000/recipe/ofTheDay", {
    method:"GET",
}).then(response => response.json())
    .then(response => {
        fetch("http://localhost:3000/user/"+response["creatorID"], {
            method:"GET"
        }).then(async resp => {
            let data = {}
            try {
                data["data"] = await resp.json()
            } catch (SyntaxError) {
                data["creatorID"] = response["creatorID"]
            }
            data["status"] = resp.status
            return data;
        }).then(response => {
            console.log("loading response...\n")
            console.log("user: " + response["creatorID"])
            if (response["status"] === 200) {
                console.log(response["data"])
            }else {
                console.log("error! status code: " + response.status.toString())
            }
        })
    })