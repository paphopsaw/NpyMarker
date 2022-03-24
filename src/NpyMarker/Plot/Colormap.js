import Array2D from "../Core/Array2D";
import { Color } from "./ColorRGBA";

export default class Colormap {
    vmin
    vmax
    colorList

    constructor(vmin = 0, vmax = 1, colorScale="gray") {
        this.colorList = [];
        this.vmin = vmin;
        this.vmax = vmax;
        this.getColorList(colorScale);
    }
    
    addColor(color) {
        this.colorList.push(color);
    }

    clearColor() {
        this.colorList = [];
    }

    async getImage(array2d) {
        const width = array2d.shape[1];
        const height = array2d.shape[0];
        const raw = new Uint8ClampedArray(width*height*4); // 4 for RBGA
        /*Convert numbers in array2d into image rgb*/
        /* Can we accelerate this with WebGL? */
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                const normalizedValue = (array2d.get(i, j) - this.vmin) / (this.vmax - this.vmin);
                raw[i * width * 4 + j * 4] = this.getColorInt(normalizedValue, 'r');
                raw[i * width * 4 + j * 4 + 1] = this.getColorInt(normalizedValue, 'g');
                raw[i * width * 4 + j * 4 + 2] = this.getColorInt(normalizedValue, 'b');
                raw[i * width * 4 + j * 4 + 3] = this.getColorInt(normalizedValue, 'a');
            }
        }
        return new ImageData(raw, width, height);
    }

    getColorList(colorScale) {
        if (colorScale === "gray") {
            this.colorList = [];
            this.colorList.push(new Color(0, 0, 0));
            this.colorList.push(new Color(255,255,255));
        }
        if (colorScale === "rwb") {
            this.colorList = [];
            this.colorList.push(new Color(255, 0, 0));
            this.colorList.push(new Color(255,255,255));
            this.colorList.push(new Color(0,0,255));
        }
    }

    getColorInt(normalizedValue, color) {
        //If normalized Value is clipped return index before last index
        if (normalizedValue >= 1) {
            return this.colorList[this.colorList.length - 1][color];
        }
        if (normalizedValue <= 0) {
            return this.colorList[0][color];
        }
        const numBlocks = this.colorList.length - 1;
        let startIndex = Math.floor(normalizedValue * numBlocks);
        let endIndex = startIndex + 1;
        //Normalized within block
        const rebaseValue = (normalizedValue - (startIndex / numBlocks)) * numBlocks;
        return Math.round(this.colorList[startIndex][color] + rebaseValue * (this.colorList[endIndex][color] - this.colorList[startIndex][color]));
    }

}