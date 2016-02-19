'use strict';

const HeightCoordinates = require('./heightcoodinates');

const CONVERGE_EVERY = 5;
const CONVERGE_FACTOR = 50;
const ERROR_MIN = 0.1;

const cc = 0.25;
const ce = 0.5;
const initial_error = 10;

module.exports = class VivaldiPosition {
	constructor(coords) {
		if (!(coords instanceof HeightCoordinates)) {
			throw new TypeError('Argument 1 must be a HeightCoordinates');	
		}
		
		this._coordinates = coords;
		this._error = initial_error;
		this._nbUpdates = 0;
	}
	
	static create(error) {
		var np = new VivaldiPosition(new HeightCoordinates(0, 0, 0))

		if (error !== void 0) {
			np.setErrorEstimate( error );
		}
		
		return np;
	}
	
	getCoordinates() {
		return this._coordinates;
	}
	
	getLocation() {
		this._coordinates.getCoordinates();
	}
	
	getErrorEstimate() {
		return this._error;
	}
	
	setErrorEstimate(e) {
		this._error = Number(e);
	}
	
	/**
	 * @param {number} rtt
	 * @param {HeightCoordinates|Float32Array|VivaldiPosition} cj
	 * @param {number} ej
	 */
	update(rtt, cj, ej) {
		if (cj instanceof Float32Array) {
			return this.update(rtt, new HeightCoordinates(cj[0], cj[1], cj[2]), cj[3]);
		}
		
		if (cj instanceof VivaldiPosition) {
			return this.update(rtt, cj.getCoordinates(), cj.getErrorEstimate());
		}
		
		if (!valid(rtt) || !cj.isValid() || !valid(ej)) {
			return false;	// throw error may be
		}
		
		var error = this._error;

		// Ensure we have valid data in input
		// (clock changes lead to crazy rtt values)
		if (rtt <= 0 || rtt > 5 * 60 * 1000) return false;
		if (error + ej == 0) return false;
		
		// Sample weight balances local and remote error. (1)
		var w = error / (ej + error);
		
		// Real error
		var re = rtt - this._coordinates.distance(cj);
		
		// Compute relative error of this sample. (2)
		var es = Math.abs(re) / rtt;
		
		// Update weighted moving average of local error. (3)
		var new_error = es * ce * w + error * (1 - ce * w);
		
		// Update local coordinates. (4)
		var delta = cc * w;
		var scale = delta * re;
		
		var random_error = new HeightCoordinates(Math.random() / 10, Math.random() / 10, 0);
		var new_coordinates = this._coordinates.add(this._coordinates.sub(cj.add(random_error))
			.unity().scale(scale));
			
		if (valid(new_error) && new_coordinates.isValid()) {
			this._coordinates = new_coordinates;
			this._error = new_error > ERROR_MIN ? new_error : ERROR_MIN;
		} else {
			this._coordinates = new HeightCoordinates(0, 0, 0);
			this._error = initial_error;
		}
		
		if(!cj.atOrigin()) {
			this._nbUpdates++;
		}
		if(this._nbUpdates > CONVERGE_EVERY) {
			this._nbUpdates = 0;
			this.update(10,new HeightCoordinates(0,0,0),CONVERGE_FACTOR);
		}
		
		return true;
	}
	
	isValid() {
		return !Number.isNaN(this._error) && this.getCoordinates().isValid();
	}
	
	/**
	 * @param {HeightCoordinates|VivaldiPosition} data
	 * @returns {number}
	 */
	estimateRTT(data) {
		if (data instanceof HeightCoordinates) {
			return this._coordinates.distance(data);
		} else if (data instanceof VivaldiPosition) {
			let coords = data.getCoordinates();
			
			if (coords.atOrigin() || this._coordinates.atOrigin()) {
				return NaN;	
			}
			
			return this._coordinates.distance(coords);
		}
	}
	
	toFloatArray() {
		return new Float32Array([this._coordinates.x, this._coordinates.y, this._coordinates.h, this._error]);
	}
	
	static fromFloatArray(data) {
		var coords = new HeightCoordinates(data[0], data[1], data[2]);

		var pos = new VivaldiPosition(coords);
		pos.setErrorEstimate(data[3]);
		
		return pos;
	}
	
	equals(other) {
		if (other instanceof VivaldiPosition) {
			if (other._error !== this._error) {
				return false;
			}	
			
			if (!other._coordinates.equals(this._coordinates)) {
				return false;
			}
			
			return true;
		}
		
		return false;
	}
}

function valid(f) {
	return Number.isFinite(f);
}