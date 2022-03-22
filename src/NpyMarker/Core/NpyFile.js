export default class NpyFile {
    file
    descr
    fortranOrder
    shape
    arrayBuffer

    constructor(file) {
        this.file = file
    }

    setFile(file) {
        this.file = file
    }

    parseHeader(headerString) {
        this.descr = /('descr') *: *'(\S+)'/.exec(headerString)[2];
        this.fortranOrder = ("True" === /('fortran_order') *: *(\w+)/.exec(headerString)[2]);
        this.shape = JSON.parse(/('shape') *: *(\(.+\))/.exec(headerString)[2].replace(/\(/,"[").replace(/\)/,"]"));
    }
}