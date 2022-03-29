export default class ViewElement {
    domObject
    name
    width
    height

    getDOM() {
        return this.domObject;
    }
    setWidth(width) {
        this.width = width;
        this.domObject.style.width = width + "px";
        this.domObject.width = width;
    }
    setHeight(height) {
        this.height = height;
        this.domObject.style.height = height + "px";
        this.domObject.height = height;
    }
    setName(name) {
        this.name = name;
        this.domObject.setAttribute("name", name);
    }
    setBorder(borderSpec) {
        this.domObject.style.border = borderSpec;
    }
}