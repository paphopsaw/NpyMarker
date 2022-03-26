import ViewElement from "./ViewElement";

export default class FileInput extends ViewElement {
    constructor() {
        super();
        this.domObject = document.createElement("input");
        this.domObject.setAttribute("type", "file");
    }

    onChange(callback) {
        this.domObject.addEventListener("change" , function(e) {
            callback(e)
        })
    }
}