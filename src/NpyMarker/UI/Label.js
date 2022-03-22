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
export default class Label {
    labelDOM;

    constructor(labelType, text) {
        if (!(labelType instanceof LabelType)) {
            throw "Invalid label type";
        }
        this.labelDOM = document.createElement(labelType.type);
        this.labelDOM.innerText = text;
    }

    setText() {
        this.labelDOM.innerText = text;
    }

    getDOM() {
        return this.labelDOM;
    }
}