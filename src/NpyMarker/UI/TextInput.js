import ViewElement from "./ViewElement";

export default class TextInput extends ViewElement {
    value
    constructor() {
        super();
        this.domObject = document.createElement("input");
        this.domObject.type = "text";
        this.domObject.oninput = "this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');";
    }

    setValue(value) {
        this.value = value;
        this.domObject.value = value;
    }

    onKeyup(callback) {
        this.domObject.addEventListener("keyup" , function(e) {
            callback(e)
        })
    }

}