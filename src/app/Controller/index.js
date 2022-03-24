export default class Controller {
    view
    state
    constructor(view, state) {
        this.view = view
        this.state = state
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
        const file = e.target.files[0];
        this.state.npyFile.setFile(file);
        this.state.npyFile.loadHeader().then(() => {
            console.log("elementType: " + this.state.npyFile.elementType)
            console.log("bytePerElement: " + this.state.npyFile.bytesPerElement)
            console.log("shape: " + this.state.npyFile.shape)
            return this.state.npyFile.getSlice2DFrom3D(64, 0);
        }).then(array2d => {
            console.log(array2d);
            this.state.colorMap.vmin = -5000;
            this.state.colorMap.vmax = 5000;
            return this.state.colorMap.getImage(array2d);
        }).then(imageData => {
            return createImageBitmap(imageData);
        }).then(bitmap => {
            console.log(bitmap);
            this.view.getChild("canvas").drawImage(bitmap);
        });
    }
}