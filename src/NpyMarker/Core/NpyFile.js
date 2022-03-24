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
    fortranOrder
    littleEndian
    elementType //f, i, u
    bytesPerElement
    shape
    length
    size
    dataBuffer

    constructor(file) {
        this.file = file
    }

    setFile(file) {
        this.file = file
    }

    async loadHeader(callback) {
        let contentBuffer = await readFileAsync(this.file);
        const headerLength = new Int16Array(contentBuffer.slice(8,10))[0];
        const headerString = String.fromCharCode.apply(null, new Int8Array(contentBuffer.slice(10, 10 + headerLength)));
        const descr = /('descr') *: *'(\S+)'/.exec(headerString)[2];
        this.fortranOrder = ("True" === /('fortran_order') *: *(\w+)/.exec(headerString)[2]);
        this.shape = JSON.parse(/('shape') *: *(\(.+\))/.exec(headerString)[2].replace(/\(/,"[").replace(/\)/,"]"));
        this.littleEndian = (descr[0] === "<"); 
        this.elementType = descr[1];
        this.bytesPerElement = parseInt(descr.substring(2));
        this.length = this.shape.reduce((a, b) => a * b, 1);
        this.size = this.bytesPerElement * this.length;;
        

        this.dataBuffer = contentBuffer.slice(10 + headerLength);
    }

    async getData() {
        const dataView = new DataView(this.dataBuffer);
        if (this.elementType === 'f') {
            if (this.bytesPerElement == 4) {
                const typedArray = new Float32Array(this.length);
                for (let i = 0; i < this.length; i++) {
                    typedArray[i] = dataView.getFloat32(i * this.bytesPerElement, this.littleEndian);
                }
                return typedArray;
            }
            if (this.bytesPerElement == 8) {
                const typedArray = new Float64Array(this.length);
                for (let i = 0; i < this.length; i++) {
                    typedArray[i] = dataView.getFloat64(i * this.bytesPerElement, this.littleEndian);
                }
                return typedArray;
            }
        }
        if (this.elementType === 'i') {
            if (this.bytesPerElement == 1) {
                const typedArray = new Int8Array(this.length);
                for (let i = 0; i < this.length; i++) {
                    typedArray[i] = dataView.getInt8(i * this.bytesPerElement, this.littleEndian);
                }
                return typedArray;
            }
            if (this.bytesPerElement == 2) {
                const typedArray = new Int16Array(this.length);
                for (let i = 0; i < this.length; i++) {
                    typedArray[i] = dataView.getInt16(i * this.bytesPerElement, this.littleEndian);
                }
                return typedArray;
            }
            if (this.bytesPerElement == 4) {
                const typedArray = new Int32Array(this.length);
                for (let i = 0; i < this.length; i++) {
                    typedArray[i] = dataView.getInt32(i * this.bytesPerElement, this.littleEndian);
                }
                return typedArray;
            }
            if (this.bytesPerElement == 8) {
                const typedArray = new BigInt64Array(this.length);

                for (let i = 0; i < this.length; i++) {
                    typedArray[i] = dataView.getBigInt64(i * this.bytesPerElement, this.littleEndian);
                }
                return typedArray;
            }
            
        }
        if (this.elementType === 'u') {
            if (this.bytesPerElement == 1) {
                const typedArray = new Uint8Array(this.length);
                for (let i = 0; i < this.length; i++) {
                    typedArray[i] = dataView.getUint8(i * this.bytesPerElement, this.littleEndian);
                }
                return typedArray;
            }
            if (this.bytesPerElement == 2) {
                const typedArray = new Uint16Array(this.length);
                for (let i = 0; i < this.length; i++) {
                    typedArray[i] = dataView.getUint16(i * this.bytesPerElement, this.littleEndian);
                }
                return typedArray;
            }
            if (this.bytesPerElement == 4) {
                const typedArray = new Uint32Array(this.length);
                for (let i = 0; i < this.length; i++) {
                    typedArray[i] = dataView.getUint32(i * this.bytesPerElement, this.littleEndian);
                }
                return typedArray;
            }
            if (this.bytesPerElement == 8) {
                const typedArray = new BigUint64Array(this.length);
                for (i = 0; i < this.length; i++) {
                    typedArray[i] = dataView.getBigUint64(i * this.bytesPerElement, this.littleEndian);
                }
                return typedArray;
            }
        }
    }
}