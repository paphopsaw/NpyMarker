function parseCSV(pointStringList) {
    let csvString = ""
    for (let pointString of pointStringList) {
        csvString += pointString + "\n";
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
        this.view.getElement("canvas").onAuxClick(this.canvasOnAuxClickHandler.bind(this));
        this.view.getElement("fileInput").onChange(this.fileOnChangeHandler.bind(this));
        this.view.getElement("radio-1").onChange(this.radioOnChangeHandler.bind(this));
        this.view.getElement("radio-2").onChange(this.radioOnChangeHandler.bind(this));
        this.view.getElement("radio-3").onChange(this.radioOnChangeHandler.bind(this));
        this.view.getElement("button-left").onClick(this.indexButtonOnClickHandler.bind(this, "left"));
        this.view.getElement("button-right").onClick(this.indexButtonOnClickHandler.bind(this, "right"));
        this.view.getElement("index-text").onKeyup(this.indexTextOnKeyupHandler.bind(this));
        this.view.getElement("save-marks-as-csv-botton").onClick(this.saveAsCsvButtonOnClickHandler.bind(this));
        this.view.getElement("load-marks-from-csv-botton").onClick(this.loadFromCsvButtonOnClickHandler.bind(this));
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
        if (this.state.npyFile.file != null) {
            const index = this.state.index;
            const x = Math.round(e.canvasX);
            const y = Math.round(e.canvasY);
            if (this.state.dimension === 0) {
                this.state.marks.add([index, x, y].toString());
            } else if (this.state.dimension === 1) {
                this.state.marks.add([x, index, y].toString());
            } else if (this.state.dimension === 2) {
                this.state.marks.add([x, y, index].toString());
            }
            this.renderUI()
            this.renderCanvas();
        }
    }

    canvasOnAuxClickHandler(e) {
        const index = this.state.index;
        const x = Math.round(e.canvasX);
        const y = Math.round(e.canvasY);
        const halfEraserSize = 3;
        if (this.state.dimension === 0) {
            for (let i = -halfEraserSize; i < halfEraserSize + 1; i++) {
                for (let j = -halfEraserSize; j < halfEraserSize + 1; j++) {
                    this.state.marks.delete([index, x + i, y + j].toString());
                }
            }
        } else if (this.state.dimension === 1) {
            for (let i = -halfEraserSize; i < halfEraserSize + 1; i++) {
                for (let j = -halfEraserSize; j < halfEraserSize + 1; j++) {
                    this.state.marks.delete([x + i, index, y + j].toString());
                }
            }
        } else if (this.state.dimension === 2) {
            for (let i = -halfEraserSize; i < halfEraserSize + 1; i++) {
                for (let j = -halfEraserSize; j < halfEraserSize + 1; j++) {
                    this.state.marks.delete([x + i, y + j, index].toString());
                }
            }
        }
        this.renderUI()
        this.renderCanvas();
    }
    
    fileOnChangeHandler(e) {
        const file = e.target.files[0];
        this.state.npyFile.setFile(file);
        this.state.npyName = file.name;
        this.state.npyFile.loadHeader().then(() => {
            console.log("elementType: " + this.state.npyFile.elementType)
            console.log("bytePerElement: " + this.state.npyFile.bytesPerElement)
            console.log("shape: " + this.state.npyFile.shape)
            this.state.marks = new Set()
            this.renderCanvas()
            this.renderUI();
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
                const maxIndex = this.state.npyFile.shape[this.state.dimension] - 1;
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
                //Check edges
                this.state.index = (this.state.index < 0) ? 0 : this.state.index;
                const maxIndex = this.state.npyFile.shape[this.state.dimension] - 1;
                this.state.index = (this.state.index > maxIndex) ? maxIndex : this.state.index;
            }
            this.renderUI();
            this.renderCanvas();
        }
    }

    saveAsCsvButtonOnClickHandler(e) {
        const blob = new Blob([parseCSV(this.state.marks)],{ type: "text/plain;charset=utf-8" });
        const blobUrl = URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.href = blobUrl;
        link.download = this.state.npyName.replace(/\.[^/.]+$/, "") +  "_marks_" + (new Date().toJSON().replaceAll(":", ".")) + ".csv";
        link.click();
    }

    loadFromCsvButtonOnClickHandler(e) {

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
                this.view.getElement("canvas").setZoom(2);
                this.view.getElement("canvas").drawImage(bitmap);
                //Draw points
                for (let pointString of this.state.marks) {
                    const point = JSON.parse("[" + pointString + "]");
                    if (point[this.state.dimension] === this.state.index) {
                        let x;
                        let y;
                        if (this.state.dimension === 0) {
                            x = point[1];
                            y = point[2];
                        } else if (this.state.dimension === 1) {
                            x = point[0];
                            y = point[2];
                        } else if (this.state.dimension === 2) {
                            x = point[0];
                            y = point[1];
                        }
                        this.view.getElement("canvas").drawPoint(x, y);
                    }
                }
            });
        }
    }
}