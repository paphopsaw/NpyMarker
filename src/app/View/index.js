import Canvas from "NpyMarker/UI/Canvas";
import FileInput from "NpyMarker/UI/FileInput";
import Label, {LabelType} from "NpyMarker/UI/Label";
import VerticalContainer from "NpyMarker/UI/VerticalContainer";
import HorizontalContainer from "NpyMarker/UI/HorizontalContainer";
import RadioButton from "NpyMarker/UI/RadioButton";

const root = {
    rootDOM: null,
    lookUpTable: {},
    lookUpTableGroup: {},
    appendChild: function (viewElement) {
        this.rootDOM.appendChild(viewElement.getDOM());
    },
    register: function (viewElement, key) {
        this.lookUpTable[key] = viewElement;
    },
    registerToGroup: function (viewElement, key) {
        if (this.lookUpTableGroup[key] == null) {
            this.lookUpTableGroup[key] = [];
        }
        this.lookUpTableGroup[key].push(viewElement);
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
        const radio1 = new RadioButton();
        radio1.setValue("0");
        radio1.setName("group-dimension");
        radio1.setText("[i, :, :]");
        controlPanelContainer.appendChild(radio1);
        root.register(radio1, "radio-1");

        const radio2 = new RadioButton();
        radio2.setValue("1");
        radio2.setName("group-dimension");
        radio2.setText("[:, i, :]");
        controlPanelContainer.appendChild(radio2);
        root.register(radio2, "radio-2");

        const radio3 = new RadioButton();
        radio3.setValue("2");
        radio3.setName("group-dimension");
        radio3.setText("[:, :, i]");
        controlPanelContainer.appendChild(radio3);
        root.register(radio3, "radio-3");
    },

    getElement: (name) => {
        if (root.lookUpTable[name] != null) {
            return root.lookUpTable[name]
        }
        throw "No viewElement of name \"" + name + "\" registered on look up table.";
    }
}