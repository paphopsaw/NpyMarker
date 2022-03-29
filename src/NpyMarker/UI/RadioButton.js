import ViewElement from "./ViewElement";

export default class RadioButton extends ViewElement {
    value
    radio
    text
    constructor() {
        super();
        this.domObject = document.createElement("label");
        this.radio = document.createElement("input");
        this.radio.setAttribute("type", "radio");
        this.domObject.appendChild(this.radio);
    }

    setText(text) {
        this.text = text;
        if (this.domObject.childNodes.length === 1) {
            this.domObject.appendChild(document.createTextNode(text));
        } else {
            this.domObject.childNodes[1].nodeValue = text;
        }
    }

    getRadio() {
        return this.radio;
    }

    setName(name) {
        this.radio.setAttribute("name", name);
    }

    setValue(value) {
        this.value = value;
        this.radio.setAttribute("value", value);
    }

    setChecked(checked) {
        this.radio.setAttribute("checked", checked);
    }

    onChange(callback) {
        this.radio.addEventListener("change" , function(e) {
            callback(e)
        })
    }

}