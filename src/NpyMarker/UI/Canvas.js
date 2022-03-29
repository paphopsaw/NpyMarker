import ViewElement from "./ViewElement";

export default class Canvas extends ViewElement {
    context
    zoom
    constructor(contextType) {
        super();
        this.domObject = document.createElement("canvas");
        this.domObject.style.flexGrow = 0;
        this.domObject.style.flexShrink = 0;
        this.context = this.domObject.getContext(contextType);
        this.zoom = 1;
    }

    setSmoothing(enabled) {
        this.context.imageSmoothingEnabled = enabled;
    }

    setZoom(x) {
        this.zoom = x;
        this.domObject.style.width = this.width * x + "px";
        this.domObject.style.height = this.height * x + "px";
    }


    drawImage(image) {
        this.context.drawImage(image, 0 , 0, this.width, this.height);
    }

    drawPoint(x, y, pointSize = 3, color = "red") {
        this.context.fillStyle = "red";
        this.context.beginPath();
        this.context.ellipse(x, y, pointSize / 2, pointSize / 2, 0, 0, 2 * Math.PI);
        this.context.fill();
    }

    onClick(callback) {
        const domObject = this.domObject;
        const customCallback = function(e) {
            const rect = domObject.getBoundingClientRect();
            e.canvasX = (e.clientX - rect.left) / this.zoom;
            e.canvasY = (e.clientY - rect.top) / this.zoom;
            callback(e)
        }
        domObject.addEventListener("click" , customCallback.bind(this));
    }

    onAuxClick(callback) {
        const domObject = this.domObject;
        const customCallback = function(e) {
            const rect = domObject.getBoundingClientRect();
            e.canvasX = (e.clientX - rect.left) / this.zoom;
            e.canvasY = (e.clientY - rect.top) / this.zoom;
            callback(e)
        }
        domObject.addEventListener("auxclick" , customCallback.bind(this))
    }
}