import Canvas from "NpyMarker/UI/Canvas";
import FileInput from "NpyMarker/UI/FileInput";
import Label, {LabelType} from "NpyMarker/UI/Label";

const root = {
    rootDOM: null,
    child: {},
    append: function (viewElement, name) {
        this.rootDOM.appendChild(viewElement.getDOM());
        this.child[name] = viewElement;
    }
}
export default {
    init: (rootDOM) => {
        root.rootDOM = rootDOM;
        //Add title label
        const title = new Label(LabelType.H1, "Welcome to Webseis");
        root.append(title, "title");
        //Add fileInput
        const fileInput = new FileInput();
        root.append(fileInput, "fileInput");
        //Add canvas
        const canvas = new Canvas("2d");
        canvas.setHeight(400);
        canvas.setWidth(600);
        root.append(canvas, "canvas")
        console.log(canvas.height);
    },

    getChild: (name) => root.child[name]
}