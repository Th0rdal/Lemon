

let body = {
    "username": "bot",
    "email": "webprojectlemon@gmail.com",
    "password": "1BotPassword?"
};
fetch("http://localhost:3000/register", {
    method:"POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify(body)
}).then(async resp => {
    let data = {}
    try {
        data["data"] = await resp.json()
    } catch (SyntaxError) {}
    data["status"] = resp.status
    return data;
}).then(response => {
    console.log("response...");
    if (response.status === 204) {
        console.log("accepted");
    }else {
        console.log("error! status code: " + response.status.toString() + "\nerror message: " + response.data.message);
    }
})