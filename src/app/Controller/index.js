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
            console.log(this.state.npyFile.descr)
            console.log(this.state.npyFile.fortranOrder)
            console.log(this.state.npyFile.shape)
        });

        /*
        var raw = new Uint8ClampedArray(20*20*4); // 4 for RBGA
        raw[0] = 255;
        raw[3] = 255;
        var imageData = new ImageData(raw, 20,20);
        const bitmap = createImageBitmap(imageData)
            .then(result => {
                this.view.getChild("canvas").drawImage(result);
            });
        */
        
    }
}