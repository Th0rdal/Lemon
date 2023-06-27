import Builder from "./Builder.js"
import {getCookie} from "../tools/cookies.js";

export class commentBuilder  extends Builder {
    constructor(comment, selfcomment) {
        super("article");
        super.configureBaseElement("comments", comment._id, "")
        let xhr = new XMLHttpRequest();
        xhr.onload = function() {
            let user = JSON.parse(xhr.responseText)
            document.getElementById("commentName_"+comment._id).textContent = user.username
        }
        xhr.open("GET", "/user/" + comment.creatorID)
        xhr.send()

        this.element.appendChild(
            super.createElement("label", {
                "class": "commentName",
                "id":"commentName_"+comment._id,
            })
        )
        let timeStamp = comment.createdAt.substring(0, comment.createdAt.lastIndexOf(".") - 3)
        timeStamp = timeStamp.replace("T", " ").replaceAll("-", " ")
        this.element.appendChild(
            super.createElement("label", {
                "class": "commentCreated",
                "textContent": timeStamp
            })
        )
        this.element.appendChild(
            super.createElement("label", {
                "class": "commentText",
                "textContent": comment.comment
            })
        )
        if (selfcomment) {
            let button = super.createElement("input", {
                "class": "deleteButton",
                "value": "delete comment",
                "type": "submit"
            })
            button.addEventListener("click", function (event) {
                let xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    if (xhr.status === 204) {
                        document.getElementById(comment._id).remove()
                    }
                }
                xhr.open("DELETE", window.location.href + "/comment");
                xhr.setRequestHeader("Authorization", getCookie("jwt"))
                xhr.setRequestHeader("Content-Type", "application/json")
                console.log(comment)
                xhr.send(JSON.stringify(comment))
            })
            this.element.appendChild(button)
        }
    }
}
