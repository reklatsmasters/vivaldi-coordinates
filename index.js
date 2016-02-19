'use strict';

const VivaldiPosition = require('./lib/vivaldiposition');
const HeightCoordinates = require('./lib/heightcoodinates');

function create(data) {
	if (data instanceof Float32Array && data.length == 4) {
		return VivaldiPosition.fromFloatArray(data);
	} else if (Array.isArray(data) && data.length == 4) {
		return VivaldiPosition.fromFloatArray(new Float32Array(data));
	} else if (isCoordinate(data)) {
		return new VivaldiPosition(data);
	} else {
		return VivaldiPosition.create(data);
	}
}

function update(rtt, p1, p2) {
	if (!isPosition(p1) || !positionOrCoordinate(p2)) {
		throw new TypeError('Argument 1 and argument 2 must be position or coordinate');	
	}
	
	return p1.update(rtt, p2);
}

function distance(p1, p2) {
	if (!isPosition(p1) || !positionOrCoordinate(p2)) {
		throw new TypeError('Argument 1 and argument 2 must be position or coordinate');	
	}
	
	return p1.estimateRTT(p2);
}

function equals(p1, p2) {
	if (positionOrCoordinate(p1)) {
		return p1.equals(p2);
	}
	
	return false;
}

/** @private */
function isPosition(p) {
	return p instanceof VivaldiPosition;
}

/** @private */
function isCoordinate(c) {
	return c instanceof HeightCoordinates;	
}

/** @private */
function positionOrCoordinate(data) {
	return isPosition(data) || isCoordinate(data);
}

module.exports = {
	create,
	update,
	distance,
	equals,
	VivaldiPosition,
	HeightCoordinates
}