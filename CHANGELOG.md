# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

- Bitmask 1 to n bit inside word convert to boolean or other types, ex. U16M254
- Error on scale 462,9 to U16 4628,9999999999

## [0.2.1] - 2018-09-16

### Fixed

- Conversion output from modbus to value BigEndian

## [0.2.0] - 2018-08-16

### Added

- Reverse mode with in and out format. This offer sending data to registers or reading registers to data

### Changed

- Scale up and down in place of scale
- Possibility to output a Number, an Array or a TypedArray


## [0.1.0] - 2018-05-03

### Added

- Converter for 8, 16, 32 and 64 bits
