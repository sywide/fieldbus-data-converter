# Fieldbus dataformat converter

FDC is a javascript converter library for converting values from differents fieldbus protocol.

It translate Bytes buffer to javascript integer or float.

- inData:     array
- inFormat:   string [abc]
  - a is the type:
    - U: Unsigned (8, 16 and 32 bits)
    - S: Signed (16 and 32 bits)
    - F: Float (32 and 64 bits)
  - b is the size:
    - 8 bits
    - 16 bits
    - 32 bits
    - 64 bits
  - c is the endianness
    - B: Big-endian
    - L: Little-endian
    - BS: Big-endian byte swap
    - LS: Little-endian byte swap
- inScale:    multiplicator

## TODO

Add new format like 64-bits integer

Comonway® is a trademark of Eyxance
© Copyright 2018 Eyxance - All right reserved