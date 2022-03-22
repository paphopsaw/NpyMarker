export default class Controller {
    view
    constructor(view) {
        this.view = view
        this.addEventHandler();

    }

    addEventHandler() {
        this.view.getChild("canvas").onClick(this.canvasOnClickHandler.bind(this));
        this.view.getChild("fileInput").onChange(this.fileOnChangeHandler.bind(this));
    }

    canvasOnClickHandler(e) {
        console.log(e.canvasX, e.canvasY);
    }
    
    fileOnChangeHandler(e) {
        //const file = e.target.files[0];
        var raw = new Uint8ClampedArray(20*20*4); // 4 for RBGA
        raw[0] = 255;
        raw[3] = 255;
        var imageData = new ImageData(raw, 20,20);
        const bitmap = createImageBitmap(imageData)
            .then(result => {
                this.view.getChild("canvas").drawImage(result);
            });
    }
}