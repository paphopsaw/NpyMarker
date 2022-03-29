function parseCSV(pointList) {
    let csvString = ""
    for (let point of pointList) {
        csvString += point[0] + ", " + point[1] + ", " + point[2] + "\n";
    }
    return csvString;
}
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
        this.view.getElement("index-text").onKeyup(this.indexTextOnKeyupHandler.bind(this));
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
        this.view.getElement("marks-label").setText(parseCSV(this.state.marks));

    }

    canvasOnClickHandler(e) {
        const index = this.state.index;
        const x = Math.round(e.canvasX);
        const y = Math.round(e.canvasY);
        if (this.state.dimension === 0) {
            this.state.marks.push([index, x, y]);
        } else if (this.state.dimension === 1) {
            this.state.marks.push([x, index, y]);
        } else if (this.state.dimension === 2) {
            this.state.marks.push([x, y, index]);
        }
        this.renderUI()
        this.renderCanvas();
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
        this.renderCanvas();
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

    indexTextOnKeyupHandler(e) {
        //If press "Enter" (keycode = 13)
        if (e.keyCode === 13) {
            const inputString = e.target.value;
            if (!isNaN(parseInt(inputString))) {
                this.state.index = parseInt(inputString);
            }
            this.renderUI();
            this.renderCanvas();
        }
    }

    renderCanvas() {
        if (this.state.npyFile.file != null) {
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
}