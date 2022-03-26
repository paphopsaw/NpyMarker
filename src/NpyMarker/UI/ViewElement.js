export default class ViewElement {
    domObject
    width
    height
    name


    getDOM() {
        return this.domObject;
    }
    setWidth(width) {
        this.width = width
        this.domObject.style.width = width + "px";
    }
    setHeight(height) {
        this.height = height
        this.domObject.style.height = height + "px";
    }
    setName(name) {
        this.name = name;
        this.domObject.setAttribute("name", name);
    }
}