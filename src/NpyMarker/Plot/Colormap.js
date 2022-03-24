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
        const width = array2d.shape[0];
        const height = array2d.shape[1];
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
            this.colorList.push(new Color(0, 0, 0));
            this.colorList.push(new Color(255,255,255));
        }
    }

    getColorInt(value, color) {
        if (color === 'r') {
            return Math.round(this.colorList[0].r + value * (this.colorList[1].r - this.colorList[0].r));
        }
        if (color === 'g') {
            return Math.round(this.colorList[0].g + value * (this.colorList[1].g - this.colorList[0].g));
        }
        if (color === 'b') {
            return Math.round(this.colorList[0].b + value * (this.colorList[1].b - this.colorList[0].b));
        }
        if (color === 'a') {
            return Math.round(this.colorList[0].a + value * (this.colorList[1].a - this.colorList[0].a));
        }
    }

}