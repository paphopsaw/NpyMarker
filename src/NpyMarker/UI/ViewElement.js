export default class ViewElement {
    domObject
    width
    height
    getDOM() {
        return this.domObject;
    }
    setWidth(width) {
        this.width = width
        this.domObject.setAttribute("width", width);
    }
    setHeight(height) {
        this.height = height
        this.domObject.setAttribute("height", height);
    }
}