import ViewElement from "./ViewElement";

export default class Container extends ViewElement {
    children
    constructor() {
        super();
        this.children = [];
        this.domObject = document.createElement("div");
    }

    appendChild(viewElement) {
        this.domObject.appendChild(viewElement.getDOM());
        this.children.push(viewElement);
    }
}