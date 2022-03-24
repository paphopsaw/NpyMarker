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
    dataView

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
        this.dataView = new DataView(this.dataBuffer);
    }

    async getData() {
        const typedArray = this.getEmptyArray(this.length);
        for (let i = 0; i < this.length; i++) {
            typedArray[i] = this.getElement(i);
        }
        return typedArray
    }

    getElement(i) {
        if (this.elementType === 'f') {
            if (this.bytesPerElement == 4) {
                return this.dataView.getFloat32(i * this.bytesPerElement, this.littleEndian);
            }
            if (this.bytesPerElement == 8) {
                return this.dataView.getFloat64(i * this.bytesPerElement, this.littleEndian);
            }
        }
        if (this.elementType === 'i') {
            if (this.bytesPerElement == 1) {
                return this.dataView.getInt8(i * this.bytesPerElement, this.littleEndian);
            }
            if (this.bytesPerElement == 2) {
                return this.dataView.getInt16(i * this.bytesPerElement, this.littleEndian);
            }
            if (this.bytesPerElement == 4) {
                return this.dataView.getInt32(i * this.bytesPerElement, this.littleEndian);
            }
            if (this.bytesPerElement == 8) {
                return this.dataView.getBigInt64(i * this.bytesPerElement, this.littleEndian);
            }
            
        }
        if (this.elementType === 'u') {
            if (this.bytesPerElement == 1) {
                return this.dataView.getUint8(i * this.bytesPerElement, this.littleEndian);
            }
            if (this.bytesPerElement == 2) {
                return this.dataView.getUint16(i * this.bytesPerElement, this.littleEndian);
            }
            if (this.bytesPerElement == 4) {
                return this.dataView.getUint32(i * this.bytesPerElement, this.littleEndian);
            }
            if (this.bytesPerElement == 8) {
                return this.dataView.getBigUint64(i * this.bytesPerElement, this.littleEndian);
            }
        }
    }

    getEmptyArray(length) {
        if (this.elementType === 'f') {
            if (this.bytesPerElement == 4) {
                return new Float32Array(length);
            }
            if (this.bytesPerElement == 8) {
                return new Float64Array(length);
            }
        }
        if (this.elementType === 'i') {
            if (this.bytesPerElement == 1) {
                return new Int8Array(length);
            }
            if (this.bytesPerElement == 2) {
                return new Int16Array(length);
            }
            if (this.bytesPerElement == 4) {
                return new Int32Array(length);
            }
            if (this.bytesPerElement == 8) {
                return new BigInt64Array(length);
            }
            
        }
        if (this.elementType === 'u') {
            if (this.bytesPerElement == 1) {
                return new Uint8Array(length);
            }
            if (this.bytesPerElement == 2) {
                return new Uint16Array(length);
            }
            if (this.bytesPerElement == 4) {
                return new Uint32Array(length);
            }
            if (this.bytesPerElement == 8) {
                return new BigUint64Array(length);
            }
        }
    }

    /*
    index: in the specified direction
    dimension: 0, 1, or 2
    **Works for C-order (Fortran-order will be future implementation)
     */
    async getSlice2DFrom3D(index, dimension) {
        if (dimension.length !== 3) {
            throw "getSlice2DFrom3D() only works for 3D numpy array.";
        }
        if (index < 0 || index >= shape[dimension]) {
            throw "Index " + index + " out of scope of (" + this.shape + ") array."
        }
        if (dimension === 0) {
            
        }
        if (dimension === 1) {

        }
        if (dimension === 2) {

        }
    }
}