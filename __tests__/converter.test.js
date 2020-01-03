/* eslint-disable */
const ModbusConverter = require('../src/converter.mjs').default;

describe('ModbusConverter', () => {
  describe('constructor', () => {
    test('success Buffer', () => {
      expect(() => {
        new ModbusConverter([16797, 28468, 21504, 0], 'F64B');
      }).not.toThrow();
    });
    test('is array', () => {
      expect(() => {
        new ModbusConverter(16797, 'F64B');
      }).toThrowError("Input data isn't an array.");
    });
    test('is right format', () => {
      expect(() => {
        new ModbusConverter([16797, 21504, 0], 'S32B');
      }).toThrowError('Error on Input size and data format.');
    });
    test('format exists', () => {
      expect(() => {
        new ModbusConverter([16797, 28468, 21504, 0], 'D64B');
      }).toThrowError("Output format isn't available.");
    });
  });
  describe('converters', () => {
    test('16-bits unsigned integer', () => {
      expect(new ModbusConverter([12345], 'U16B').scale(1)).toEqual(12345);
      expect(new ModbusConverter([12345], 'U16L').scale(1)).toEqual(12345);
      expect(new ModbusConverter([14640], 'U16BS').scale(1)).toEqual(12345);
      expect(new ModbusConverter([14640], 'U16LS').scale(1)).toEqual(12345);
    });
    test('16-bits signed integer', () => {
      expect(new ModbusConverter([53191], 'S16B').scale(1)).toEqual(-12345);
      expect(new ModbusConverter([53191], 'S16L').scale(1)).toEqual(-12345);
      expect(new ModbusConverter([51151], 'S16BS').scale(1)).toEqual(-12345);
      expect(new ModbusConverter([51151], 'S16LS').scale(1)).toEqual(-12345);
    });
    test('32-bits unsigned integer', () => {
      expect(new ModbusConverter([18838, 722], 'U32B').scale(1)).toEqual(
        1234567890,
      );
      expect(new ModbusConverter([722, 18838], 'U32L').scale(1)).toEqual(
        1234567890,
      );
      expect(new ModbusConverter([38473, 53762], 'U32BS').scale(1)).toEqual(
        1234567890,
      );
      expect(new ModbusConverter([53762, 38473], 'U32LS').scale(1)).toEqual(
        1234567890,
      );
    });
    test('32-bits signed integer', () => {
      expect(new ModbusConverter([46697, 64814], 'S32B').scale(1)).toEqual(
        -1234567890,
      );
      expect(new ModbusConverter([64814, 46697], 'S32L').scale(1)).toEqual(
        -1234567890,
      );
      expect(new ModbusConverter([27062, 12029], 'S32BS').scale(1)).toEqual(
        -1234567890,
      );
      expect(new ModbusConverter([12029, 27062], 'S32LS').scale(1)).toEqual(
        -1234567890,
      );
    });
    test('32-bits float', () => {
      expect(new ModbusConverter([18417, 8192], 'F32B').scale(1)).toEqual(
        123456.0,
      );
      expect(new ModbusConverter([8192, 18417], 'F32L').scale(1)).toEqual(
        123456.0,
      );
      expect(new ModbusConverter([61767, 32], 'F32BS').scale(1)).toEqual(
        123456.0,
      );
      expect(new ModbusConverter([32, 61767], 'F32LS').scale(1)).toEqual(
        123456.0,
      );
    });
    test('64-bits double', () => {
      expect(
        new ModbusConverter([16797, 28468, 21504, 0], 'F64B').scale(1),
      ).toEqual(123456789.0);
      expect(
        new ModbusConverter([0, 21504, 28468, 16797], 'F64L').scale(1),
      ).toEqual(123456789.0);
      expect(
        new ModbusConverter([40257, 13423, 84, 0], 'F64BS').scale(1),
      ).toEqual(123456789.0);
      expect(
        new ModbusConverter([0, 84, 13423, 40257], 'F64LS').scale(1),
      ).toEqual(123456789.0);
    });
  });
});
