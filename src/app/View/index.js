import Canvas from "NpyMarker/UI/Canvas";
import FileInput from "NpyMarker/UI/FileInput";
import Label, {LabelType} from "NpyMarker/UI/Label";
import VerticalContainer from "NpyMarker/UI/VerticalContainer";
import HorizontalContainer from "../../NpyMarker/UI/HorizontalContainer";

const root = {
    rootDOM: null,
    lookUpTable: {},
    appendChild: function (viewElement) {
        this.rootDOM.appendChild(viewElement.getDOM());
    },
    register: function (viewElement, key) {
        this.lookUpTable[key] = viewElement;
    }
}
export default {
    init: (rootDOM) => {
        root.rootDOM = rootDOM;
        const mainContainer = new VerticalContainer();
        mainContainer.setName("mainContainer");
        root.appendChild(mainContainer);
        //Add title label
        const title = new Label(LabelType.H1, "Welcome to NpyMarker");
        title.setName("title");
        mainContainer.appendChild(title);
        //Add fileInput
        const fileInput = new FileInput();
        fileInput.setName("fileInput");
        mainContainer.appendChild(fileInput);
        root.register(fileInput, "fileInput");

        //Working area
        const workBenchContainer = new HorizontalContainer();
        workBenchContainer.setName("workBenchContainer");
        mainContainer.appendChild(workBenchContainer);
        //Add canvas
        const canvas = new Canvas("2d");
        canvas.setHeight(600);
        canvas.setWidth(800);
        canvas.setName("canvas")
        canvas.setBorder("black solid 1px");
        workBenchContainer.appendChild(canvas);
        root.register(canvas, "canvas");

        //Control panel
        const controlPanelContainer = new VerticalContainer();
        workBenchContainer.appendChild(controlPanelContainer);
        
    },

    getChild: (name) => {
        if (root.lookUpTable[name] != null) {
            return root.lookUpTable[name]
        }
        throw "No viewElement of name \"" + name + "\" registered on look up table.";
    }
}