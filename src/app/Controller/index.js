export default class Controller {
    view
    state
    constructor(view, state) {
        this.view = view
        this.state = state
        this.addEventHandler();
        this.renderUI();
    }

    addEventHandler() {
        this.view.getElement("canvas").onClick(this.canvasOnClickHandler.bind(this));
        this.view.getElement("fileInput").onChange(this.fileOnChangeHandler.bind(this));
        this.view.getElement("radio-1").onChange(this.radioOnChangeHandler.bind(this));
        this.view.getElement("radio-2").onChange(this.radioOnChangeHandler.bind(this));
        this.view.getElement("radio-3").onChange(this.radioOnChangeHandler.bind(this));
        this.view.getElement("button-left").onClick(this.indexButtonOnClickHandler.bind(this, "left"));
        this.view.getElement("button-right").onClick(this.indexButtonOnClickHandler.bind(this, "right"));
    }

    renderUI() {
        switch (this.state.direction) {
            case 0:
                this.view.getElement("radio-1").setChecked(true);
                break;
            case 1:
                this.view.getElement("radio-2").setChecked(true);
                break;
            case 2:
                this.view.getElement("radio-3").setChecked(true);
                break;
            default:
                this.view.getElement("radio-1").setChecked(true);
        }
        this.view.getElement("index-text").setValue(this.state.index);

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
            return this.renderCanvas()
        });
    }

    radioOnChangeHandler(e) {
        this.state.dimension = parseInt(e.target.value);
        this.state.index = 0;
        if (this.state.npyFile.file != null) {
            this.renderCanvas();
        }
        this.renderUI();
    }

    indexButtonOnClickHandler(direction, e) {
        if (this.state.npyFile.file != null) {
            if (direction === "left") {
                this.state.index -= 1;
                this.state.index = (this.state.index < 0) ? 0 : this.state.index;
            } else if (direction === "right") {
                this.state.index += 1;
                const maxIndex = this.state.npyFile.shape[this.state.dimesion] - 1;
                this.state.index = (this.state.index > maxIndex) ? maxIndex : this.state.index;
            }
            this.renderUI();
            this.renderCanvas();
        }
    }

    renderCanvas() {
        return this.state.npyFile.getSlice2DFrom3D(this.state.index, this.state.dimension)
        .then(array2d => {
            this.state.colorMap.vmin = -5000;
            this.state.colorMap.vmax = 5000;
            return this.state.colorMap.getImage(array2d, true);
        }).then(imageData => {
            return createImageBitmap(imageData);
        }).then(bitmap => {
            this.view.getElement("canvas").setWidth(bitmap.width);
            this.view.getElement("canvas").setHeight(bitmap.height);
            this.view.getElement("canvas").drawImage(bitmap);
        });
    }
}