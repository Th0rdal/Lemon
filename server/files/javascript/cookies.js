
export function getCookie(cookie) {
    let cookies = document.cookie.split(";");
    for (let index in cookies) {
        if (cookies[index].trim().startsWith("jwt")) {
            let returnCookie = cookies[index].trim().split("=")
           return returnCookie[1];
        }
    }
    return null;
}
