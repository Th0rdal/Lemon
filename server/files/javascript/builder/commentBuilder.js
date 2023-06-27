import Builder from "./Builder.js"
import {getCookie} from "../tools/cookies.js";

export class commentBuilder  extends Builder {
    constructor(comment, selfcomment) {
        super("article");
        super.configureBaseElement("comments", comment._id, "")
        this.element.appendChild(
            super.createElement("label", {
                "class":"commentName",
                "textContent":comment._id
            })
        )
        let timeStamp = comment.createdAt.substring(0, comment.createdAt.lastIndexOf(".")-3)
        timeStamp = timeStamp.replace("T", " ")
        this.element.appendChild(
            super.createElement("label", {
                "class":"commentCreated",
                "textContent":timeStamp
            })
        )
        this.element.appendChild(
            super.createElement("label", {
                "class":"commentText",
                "textContent":comment.comment
            })
        )
        if (selfcomment) {
            let button = super.createElement("input", {
                    "class":"deleteButton",
                    "value":"delete comment",
                    "type":"submit"
            })
            button.addEventListener("click", function(event) {
                let xhr = new XMLHttpRequest();
                xhr.onload = function() {
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
