'use strict';

const MAX_X = 30000;
const MAX_Y = 30000;
const MAX_H = 30000;

module.exports = class HeightCoordinates {
	constructor(x, y, h) {
		this.x = x;
		this.y = y;
		this.h = h;
	}
	
	/**
	 * @param {HeightCoordinates} other
	 */
	add(other) {
		return new HeightCoordinates(
			this.x + other.x,
			this.y + other.y,
			Math.abs(this.h + other.h)
		);
	}
	
	/**
	 * @param {HeightCoordinates} other
	 */
	sub(other) {
		return new HeightCoordinates(
			this.x - other.x,
			this.y - other.y,
			Math.abs(this.h + other.h)
		);
	}
	
	/**
	 * @param {number} scale
	 */
	scale(scale) {
		return new HeightCoordinates(
			scale * this.x,
			scale * this.y,
			scale * this.h
		);
	}
	
	measure() {
		return Math.sqrt(this.x * this.x + this.y * this.y) + this.h;
	}
	
	atOrigin() {
		return this.x == 0 && this.y == 0;
	}
	
	isValid() {
		return valid(this.x) &&
			valid(this.y) &&
			valid(this.h) &&
			Math.abs(this.x) <= MAX_X &&
			Math.abs(this.y) <= MAX_Y &&
			Math.abs(this.h) <= MAX_H
	}
	
	distance(other) {
		return this.sub(other).measure();
	}
	
	unity() {
		var measure = this.measure();
		
		if (!measure) {
			//Special Vivaldi Case, when u(0) = random unity vector
			return new HeightCoordinates(
				Math.random(),
				Math.random(),
				Math.random()).unity();
		}
		
		return this.scale(1 / measure);
	}
	
	getCoordinates() {
		return [this.x, this.y];
	}
	
	equals(other) {
		if (other instanceof HeightCoordinates) {
			if (other.x != this.x || other.y != this.y || other.h != this.h) {
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
