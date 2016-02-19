'use strict';

const MAX_X = 30000;
const MAX_Y = 30000;
const MAX_H = 30000;

class HeightCoordinates {
	constructor(x, y, h) {
		this.x = x;
		this.y = y;
		this.h = h;
	}
	
	/**
	 * @param {HeightCoordinates} other
	 */
	add(other) {
		return primitive(this, other, 1)
	}
	
	/**
	 * @param {HeightCoordinates} other
	 */
	sub(other) {
		return primitive(this, other, -1)
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

function primitive(c1, c2, scale) {
	return new HeightCoordinates(
		c1.x + c2.x * scale,
		c1.y + c2.y * scale,
		Math.abs(c1.h + c2.h)
	)
}

module.exports = HeightCoordinates