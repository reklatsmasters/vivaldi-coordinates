# vivaldi-coordinates
[![travis](https://travis-ci.org/ReklatsMasters/vivaldi-coordinates.svg)](https://travis-ci.org/ReklatsMasters/vivaldi-coordinates)
[![npm](https://img.shields.io/npm/v/vivaldi-coordinates.svg)](https://npmjs.org/package/vivaldi-coordinates)
[![license](https://img.shields.io/npm/l/vivaldi-coordinates.svg)](https://npmjs.org/package/vivaldi-coordinates)
[![downloads](https://img.shields.io/npm/dm/vivaldi-coordinates.svg)](https://npmjs.org/package/vivaldi-coordinates)
[![Code Climate](https://codeclimate.com/github/ReklatsMasters/vivaldi-coordinates/badges/gpa.svg)](https://codeclimate.com/github/ReklatsMasters/vivaldi-coordinates)
[![Test Coverage](https://codeclimate.com/github/ReklatsMasters/vivaldi-coordinates/badges/coverage.svg)](https://codeclimate.com/github/ReklatsMasters/vivaldi-coordinates)

Vivaldi: A Decentralized Network Coordinate System. Originaly description [here](https://www.cs.umd.edu/class/spring2007/cmsc711/papers/vivaldi.pdf).This package based on source code of [Vuze](https://vuze.com/) and required nodejs >= 4.

## API

##### `create(data: Float32Array): VivaldiPosition`
Create `VivaldiPosition` instance from raw coordinates. Argument `data` should have length == 4.

##### `create(data: HeightCoordinates): VivaldiPosition`
Create `VivaldiPosition` instance from `HeightCoordinates` instance.

##### `create([error: Number]): VivaldiPosition`
Create new empty `VivaldiPosition` instance. Argument `error` is optional.

##### `update(rtt: Number, p1: VivaldiPosition, p2: VivaldiPosition|HeightCoordinates): bool`
Update position `p1` with other position `p2` and time `rtt`.

##### `distance(p1: VivaldiPosition, p2: VivaldiPosition|HeightCoordinates): number`
Calculate distace between `p1` and `p2`.

##### `equals(p1, p2): bool`
Check to equals `p1` and `p2`.

## Example
```js
const vivaldi = require('vivaldi-coordinates');

var local_pos = vivaldi.create();	// create new empty pos;
var remote_pos;	// position from some remote host
var rtt = 7;	  // ping time to remote host

vivaldi.update(rtt, local_pos, remote_pos);	// update local position
```

## License
MIT, 2015 (c) Dmitry Tsvettsikh