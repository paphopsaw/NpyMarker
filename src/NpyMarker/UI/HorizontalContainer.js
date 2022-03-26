import Container from "./Container";

export default class HorizontalContainer extends Container {
    constructor() {
        super();
        this.domObject.style.display = "flex";
        this.domObject.style.flexDirection = "row";
    }
}