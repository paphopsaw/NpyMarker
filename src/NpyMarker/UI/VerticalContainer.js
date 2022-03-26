import Container from "./Container";

export default class VerticalContainer extends Container {
    constructor() {
        super();
        this.domObject.style.display = "flex";
        this.domObject.style.flexDirection = "column";
    }
}