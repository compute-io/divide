/* global describe, it, require */
'use strict';

// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Module to be tested:
	divide = require( './../lib/accessor.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'accessor divide', function tests() {

	it( 'should export a function', function test() {
		expect( divide ).to.be.a( 'function' );
	});

	it( 'should perform an element-wise division by a scalar using an accessor', function test() {
		var data, actual, expected;

		data = [
			{'x':0},
			{'x':2},
			{'x':4},
			{'x':6}
		];
		actual = new Array( data.length );
		actual = divide( actual, data, 2, getValue );

		expected = [
			0,
			1,
			2,
			3
		];

		assert.deepEqual( actual, expected );

		function getValue( d ) {
			return d.x;
		}

	});

	it( 'should perform an element-wise division of an array using an accessor', function test() {
		var data, actual, expected, y;

		data = [
			{'x':0},
			{'x':1},
			{'x':2},
			{'x':3}
		];

		y = [
			0,
			1,
			2,
			3
		];

		actual = new Array( data.length );
		actual = divide( actual, data, y, getValue );

		expected = [
			NaN,
			1,
			1,
			1
		];

		assert.deepEqual( actual, expected );

		function getValue( d, i ) {
			return d.x;
		}

	});

	it( 'should perform an element-wise multiplication of another object array using an accessor', function test() {
		var data, actual, expected, y;

		data = [
			{'x':0},
			{'x':1},
			{'x':2},
			{'x':3}
		];

		y = [
			{'y':0},
			{'y':1},
			{'y':2},
			{'y':3}
		];

		actual = new Array( data.length );
		actual = divide( actual, data, y, getValue );

		expected = [
			NaN,
			1,
			1,
			1
		];

		assert.deepEqual( actual, expected );

		function getValue( d, i, j ) {
			if ( j === 0 ) {
				return d.x;
			} else {
				return d.y;
			}
		}

	});

	it( 'should return empty array if provided an empty array', function test() {
		assert.deepEqual( divide( [], [], 1, getValue ), [] );
		function getValue( d ) {
			return d.x;
		}
	});

	it( 'should handle non-numeric values by setting the element to NaN', function test() {
		var data, actual, expected, y;

		data = [
			{'x':1},
			{'x':null},
			{'x':3}
		];
		actual = new Array( data.length );
		actual = divide( actual, data, 1, getValue );

		expected = [ 1, NaN, 3 ];

		assert.deepEqual( actual, expected );

		// single non-numeric value
		y = false;
		actual = new Array( data.length );
		actual = divide( actual, data, y, getValue );
		expected = [ NaN, NaN, NaN ];

		assert.deepEqual( actual, expected );

		// numeric array
		y = [ 1, 2, 3 ];
		actual = new Array( data.length );
		actual = divide( actual, data, y, getValue );
		expected = [ 1, NaN, 1 ];

		// typed array
		y = new Int32Array( [1,2,3] );
		actual = new Array( data.length );
		actual = divide( actual, data, y, getValue );
		expected = [ 1, NaN, 1 ];

		assert.deepEqual( actual, expected );

		// object array
		y = [
			{'y':1},
			{'y':2},
			{'y':3}
		];
		actual = new Array( data.length );
		actual = divide( actual, data, y, getValue2 );
		expected = [ 1, NaN, 1 ];

		function getValue( d, i ) {
			return d.x;
		}

		function getValue2( d, i, j ) {
			if ( j === 0 ) {
				return d.x;
			} else {
				return d.y;
			}
		}

	});

	it( 'should throw an error if dividing by a matrix which is not of equal length to the input array', function test() {
		expect( foo ).to.throw( Error );
		function foo() {
			divide( [], [1,2], [1,2,3], getValue );
		}
		function getValue( d ) {
			return d;
		}
	});

	it( 'should throw an error if dividing by a typed array which is not of equal length to the input array', function test() {
		expect( foo ).to.throw( Error );
		function foo() {
			divide( [], [1,2], new Int32Array( [1,2,3] ), getValue );
		}
		function getValue( d ) {
			return d;
		}
	});

});
