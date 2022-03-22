function readFileAsync(file) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
  
      reader.onload = () => {
        resolve(reader.result);
      };
  
      reader.onerror = reject;
  
      reader.readAsArrayBuffer(file);
    })
  }

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

    async loadHeader(callback) {
        const reader = new FileReader();
        let contentBuffer = await readFileAsync(this.file);
        const headerLength = new Int16Array(contentBuffer.slice(8,10))[0];
        const headerString = String.fromCharCode.apply(null, new Int8Array(contentBuffer.slice(10, 10 + headerLength)));
        this.parseHeader(headerString);
    }

    parseHeader(headerString) {
        this.descr = /('descr') *: *'(\S+)'/.exec(headerString)[2];
        this.fortranOrder = ("True" === /('fortran_order') *: *(\w+)/.exec(headerString)[2]);
        this.shape = JSON.parse(/('shape') *: *(\(.+\))/.exec(headerString)[2].replace(/\(/,"[").replace(/\)/,"]"));
    }

}