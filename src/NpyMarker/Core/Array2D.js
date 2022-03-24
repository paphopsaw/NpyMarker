export default class Array2D {
    shape
    array
    constructor(shape, array) {
        this.shape = shape;
        this.array = array;
    }

    get(i, j) {
        return this.array[i * this.shape[0] + j];
    }
}