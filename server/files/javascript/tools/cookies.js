
export function getCookie(cookie) {
    let cookies = document.cookie.split(";");
    for (let index in cookies) {
        if (cookies[index].trim().startsWith(cookie)) {
            let returnCookie = cookies[index].trim().split("=")
           return returnCookie[1];
        }
    }
    return null;
}

export function deleteCookie(cookie) {
    document.cookie = cookie + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
}