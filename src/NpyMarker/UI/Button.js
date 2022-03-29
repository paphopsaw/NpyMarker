import ViewElement from "./ViewElement";

export default class Button extends ViewElement {
    text
    constructor(text="") {
        super();
        this.domObject = document.createElement("button");
        this.domObject.type = "button";
        this.domObject.innerText = text;
    }

    setText(text) {
        this.text = text;
        this.domObject.innerText = text;
    }

    onClick(callback) {
        this.domObject.addEventListener("click" , function(e) {
            callback(e)
        })
    }
}