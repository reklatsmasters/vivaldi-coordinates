'use strict';
/* global describe,it */

const VivaldiPosition = require('../lib/vivaldiposition')
const HeightCoordinates = require('../lib/heightcoodinates')
const vivaldi = require('../');
//const should = require('should');
const initial_error = 10;

describe('module index', function () {
	describe('method create', function () {
		it('should created from float array', function () {
			var v = vivaldi.create(new Float32Array([1, 1, 1, 1]))

			v.should.be.instanceof(VivaldiPosition)
			v.getErrorEstimate().should.equal(1)
			v.getCoordinates().should.deepEqual({x:1, y:1, h:1})
		})
		
		it('should created from coordinates', function () {
			var v = vivaldi.create(new HeightCoordinates(1, 1, 1))
			
			v.should.be.instanceof(VivaldiPosition)
			v.getErrorEstimate().should.equal(initial_error)
			v.getCoordinates().should.deepEqual({x:1, y:1, h:1})
		})
		
		it('should created empty position', function () {
			var v = vivaldi.create()
			
			v.should.be.instanceof(VivaldiPosition)
			v.getErrorEstimate().should.equal(initial_error)
			v.getCoordinates().should.deepEqual({x:0, y:0, h:0})
		})
		
		it('should created empty position with error', function () {
			var v = vivaldi.create(12)
			
			v.should.be.instanceof(VivaldiPosition)
			v.getErrorEstimate().should.equal(12)
			v.getCoordinates().should.deepEqual({x:0, y:0, h:0})
		})
	})
	
	describe('method equals', function () {
		it('should work', function () {
			var p1 = vivaldi.create(new Float32Array([1, 1, 1, 12]))
			var p2 = vivaldi.create(new HeightCoordinates(1, 1, 1))
			p2.setErrorEstimate(12)
			
			vivaldi.equals(p1, p2).should.equal(true)
			vivaldi.equals(p1.getCoordinates(), p2.getCoordinates()).should.equal(true)
			vivaldi.equals(p1, vivaldi.create(new Float32Array([1, 1, 1, 15]))).should.not.equal(true)
			vivaldi.equals(p1, vivaldi.create(new Float32Array([1, 2, 3, 12]))).should.not.equal(true);
		})
	})
})