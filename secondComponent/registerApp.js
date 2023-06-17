

let body = {
    "username": "bot",
    "email": "webprojectlemon@gmail.com",
    "password": "1BotPassword?"
};
fetch("http://localhost:3000/register", {
    method:"POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify(body)
}).then(async response => {
    let data = await response.json()
    data["status"] = response.status
    return data
}).then(response => {
    console.log("response...");
    if (response.status === 204) {
        console.log("accepted");
    }else {
        console.log("error! status code: " + response.status.toString() + "\nerror message: " + response.message);
    }
})