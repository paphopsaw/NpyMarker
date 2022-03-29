import ViewElement from "./ViewElement";

class LabelType {
    static H1 = new LabelType("h1");
    static H2 = new LabelType("h2");
    static H3 = new LabelType("h3");
    static H4 = new LabelType("h4");
    static H5 = new LabelType("h5");
    static H6 = new LabelType("h6");
    static P  = new LabelType("p");
    constructor(type) {
        this.type = type;
    }
}

export {LabelType};
export default class Label extends ViewElement {
    constructor(labelType, text) {
        super();
        if (!(labelType instanceof LabelType)) {
            throw "Invalid label type";
        }
        this.domObject = document.createElement(labelType.type);
        this.domObject.innerText = text;
    }

    setText(text) {
        this.domObject.innerText = text;
    }

    setOverflow(overflow) {
        this.domObject.style.overflow = overflow;
    }
}