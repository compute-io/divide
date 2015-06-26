/* global describe, it, require */
'use strict';

// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Module to be tested:
	divide = require( './../lib/typedarray.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'typed-array divide', function tests() {

	it( 'should export a function', function test() {
		expect( divide ).to.be.a( 'function' );
	});

	it( 'should divide elements of two typed arrays', function test() {
		var data, actual, expected, y;

		data = new Float64Array([
			12,
			6,
			4,
			3
		]);
		y = new Float64Array([
			4,
			3,
			4,
			1
		]);
		actual = new Float64Array( data.length );

		actual = divide( actual, data, y );

		expected = new Float64Array( [3,2,1,3] );

		assert.deepEqual( expected, actual );
	});

	it( 'should throw an error if provided two typed arrays of differing lengths', function test() {
		expect( foo ).to.throw( Error );
		function foo() {
			divide( new Array(2), new Int8Array( [1,2] ), new Int8Array( [1,2,3] ) );
		}

		expect( foo2 ).to.throw( Error );
		function foo2() {
			divide( new Array(2), new Int8Array( [1,2] ), [ 1, 2, 3 ] );
		}
	});

	it( 'should handle non-numeric y values by setting the respective element to NaN', function test() {
		var data, actual, expected, y;

		data = new Float64Array([
			1,
			2,
			3,
			4
		]);
		actual = new Array( data.length );
		actual = divide( actual, data, null );

		expected = [ NaN, NaN, NaN, NaN ];

		assert.deepEqual( actual, expected );

		actual = new Array( data.length );
		y = [ 1, 2, 3, null ];
		actual = divide( actual, data, y );

		expected = [ 1, 1, 1, NaN ];

		assert.deepEqual( actual, expected );

	});

	it( 'should return an empty array if provided an empty array', function test() {
		assert.deepEqual( divide( new Int8Array(), new Int8Array() ), new Int8Array() );
	});

});
