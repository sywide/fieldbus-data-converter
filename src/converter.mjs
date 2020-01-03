/** Class representing a converter. */
class FieldbusDataConverter {
  /**
   * Create a converter.
   * @param {array} inData - The field data to be converted
   * @param {string} inFormat - The format of data
   */
  constructor(inData, inFormat, scale = 1) {
    // Control inData type
    this.inData = inData;
    if (Array.isArray(inData)) {
      this.inData = inData;
    } else if (FieldbusDataConverter.isNumber(inData)) {
      if (scale !== 1) this.inData = [FieldbusDataConverter.scaleDown(inData, scale)];
      else this.inData = [inData];
    } else throw new Error('Input must be a Number or an Array of Number.');

    // Local machine endianness detection
    this.isBigEndian = new Uint8Array(new Uint32Array([0x12345678]).buffer)[0] === 0x12;
    this.isLittleEndian = new Uint8Array(new Uint32Array([0x12345678]).buffer)[0] === 0x78;

    // inData type decomposition
    const inFormatregexp = inFormat.match(/([A-Z]*)([0-9]+)([A-Z]*)/);
    this.inDataType = inFormat.substr(0, 3);
    [this.inRegexp, this.inType, this.inSize, this.inDataEndian] = inFormatregexp;
    this.inSize = parseInt(this.inSize, 10);

    // Save inData to typedArray
    this.bufferedValue = this.toBuffer();
  }

  /**
   * Convert 16-bits unsigned array to bytes buffer.
   * @returns {Uint8Array} The bytesArray contain converter's buffer
   */
  toBytesArray(array, dataEndian) {
    // Transform to U8
    const out = new Uint8Array(array.buffer);
    // Size of buffer
    const size = out.buffer.byteLength;
    // B: Big-endian
    // L: Little-endian
    // BS: Big-endian byte swap
    // LS: Little-endian byte swap
    if (this.isBigEndian) {
      switch (dataEndian) {
        case 'L':
          if (size === 4) out.set([out[2], out[3], out[0], out[1]]);
          if (size === 8) {
            out.set([out[6], out[7], out[4], out[5], out[2], out[3], out[0], out[1]]);
          }
          break;
        case 'BS':
          if (size === 2) out.set([out[1], out[0]]);
          if (size === 4) out.set([out[3], out[2], out[1], out[0]]);
          if (size === 8) {
            out.set([out[1], out[0], out[3], out[2], out[5], out[4], out[7], out[6]]);
          }
          break;
        case 'LS':
          if (size === 2) out.set([out[1], out[0]]);
          if (size === 4) out.set([out[1], out[0], out[3], out[2]]);
          if (size === 8) {
            out.set([out[7], out[6], out[5], out[4], out[3], out[2], out[1], out[0]]);
          }
          break;
        default:
          if (size === 1) out.set();
      }
    } else if (this.isLittleEndian) {
      switch (dataEndian) {
        case 'B':
          if (size === 4) out.set([out[2], out[3], out[0], out[1]]);
          if (size === 8) {
            out.set([out[6], out[7], out[4], out[5], out[2], out[3], out[0], out[1]]);
          }
          break;
        case 'BS':
          if (size === 2) out.set([out[1], out[0]]);
          if (size === 4) out.set([out[3], out[2], out[1], out[0]]);
          if (size === 8) {
            out.set([out[7], out[6], out[5], out[4], out[3], out[2], out[1], out[0]]);
          }
          break;
        case 'LS':
          if (size === 2) out.set([out[1], out[0]]);
          if (size === 4) out.set([out[1], out[0], out[3], out[2]]);
          if (size === 8) {
            out.set([out[1], out[0], out[3], out[2], out[5], out[4], out[7], out[6]]);
          }
          break;
        default:
      }
    }
    return out;
  }

  /**
   * Convert input array to typed array
   */
  toBuffer() {
    // Save to correct data format
    const array = this.inData;
    let out;
    switch (this.inDataType) {
      // 8-bits unsigned integer
      case 'U08':
        out = new Uint8Array(array);
        break;
      // 16-bits unsigned integer
      case 'U16':
        out = new Uint16Array(array);
        break;
      // 16-bits signed integer
      case 'S16':
        out = new Int16Array(array);
        break;
      // 32-bits unsigned integer
      case 'U32':
        out = new Uint32Array(array);
        break;
      // 32-bits signed integer
      case 'S32':
        out = new Int32Array(array);
        break;
      // 32-bits float
      case 'F32':
        out = new Float32Array(array);
        break;
      // 64-bits double
      case 'F64':
        out = new Float64Array(array);
        break;
      /* Default */
      default:
        throw new Error(`Input Data format ${this.inDataType} isn't available.`);
    }
    return this.toBytesArray(out, this.inDataEndian);
  }

  /**
   * Convert to the right output format
   * @param outFormat
   */
  convertTo(outFormat, outType, scale = 1) {
    // outData type decomposition
    const outFormatregexp = outFormat.match(/([A-Z]*)([0-9]+)([A-Z]*)/);
    this.outDataType = outFormat.substr(0, 3);
    [this.outRegexp, this.outType, this.outSize, this.outDataEndian] = outFormatregexp;
    this.outSize = parseInt(this.outSize, 10);

    // Save to correct data format from endianess
    let out;

    const data = this.toBytesArray(this.bufferedValue, this.outDataEndian);
    const array = data.buffer;

    switch (this.outDataType) {
      // 8-bits unsigned integer
      case 'U08':
        out = new Uint8Array(array);
        break;
      // 16-bits unsigned integer
      case 'U16':
        out = new Uint16Array(array);
        break;
      // 16-bits signed integer
      case 'S16':
        out = new Int16Array(array);
        break;
      // 32-bits unsigned integer
      case 'U32':
        out = new Uint32Array(array);
        break;
      // 32-bits signed integer
      case 'S32':
        out = new Int32Array(array);
        break;
      // 32-bits float
      case 'F32':
        out = new Float32Array(array);
        break;
      // 64-bits double
      case 'F64':
        out = new Float64Array(array);
        break;
      /* Default */
      default:
        throw new Error(`Output Data format ${this.outDataType} isn't available.`);
    }

    // Save output Value
    switch (outType.toLowerCase()) {
      case 'number':
        [out] = out;
        if (scale !== 1) this.outData = FieldbusDataConverter.scaleUp(out, scale);
        else this.outData = out;
        break;
      case 'array':
        this.outData = Array.from(out);
        break;
      default:
        this.outData = out;
    }
    return this.outData;
  }

  /**
   * Scale down value to integer
   * @param {number} value -  The value to scale up
   * @param {float} scale - The scale adpator
   * @param {operator}
   */
  static scaleDown(value, scale) {
    return FieldbusDataConverter.doDecimalSafeMath(value, '/', scale);
  }

  /**
   * Scale up value to the right value
   * @param {integer} value -  The value to scale up
   * @param {float} scale - The scale adpator
   * @param {operator}
   */
  static scaleUp(value, scale) {
    return FieldbusDataConverter.doDecimalSafeMath(value, '*', scale);
  }

  /**
   * doDecimalSafeMath operate on number
   * @param operA
   * @param oper
   * @param operB
   * @param prec
   */
  static doDecimalSafeMath(operA, oper, operB, prec) {
    function decimalLength(numStr) {
      const pieces = numStr.toString().split('.');
      if (!pieces[1]) return 0;
      return pieces[1].length;
    }

    // Figure out what we need to multiply by to make everything a whole number
    let precision = prec || 10 ** Math.max(decimalLength(operA), decimalLength(operB));

    const a = operA * precision;
    const b = operB * precision;

    // Figure out which operation to perform.
    let operation;
    switch (oper.toLowerCase()) {
      case '-':
        operation = (x, y) => x - y;
        break;
      case '+':
        operation = (x, y) => x + y;
        break;
      case '*':
      case 'x':
        precision *= precision;
        operation = (x, y) => x * y;
        break;
      case '÷':
      case '/':
        precision = 1;
        operation = (x, y) => x / y;
        break;

      // Let us pass in a function to perform other operations.
      default:
        operation = oper;
    }

    const result = operation(a, b);

    // Remove our multiplier to put the decimal back.
    return result / precision;
  }

  /**
   * isNumber check if value is a number
   */
  static isNumber(value) {
    if (value === undefined || value === null) {
      return false;
    }
    if (typeof value === 'number') {
      return true;
    }
    return !Number.isNaN(value - 0);
  }
}

/**
 * Class representing a Modbus converter
 * @extends FieldbusDataConverter
 */
export default class ModbusConverter extends FieldbusDataConverter {}
