/* global describe, it, require, beforeEach */
'use strict';

// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Matrix data structure:
	matrix = require( 'dstructs-matrix' ),

	// Module to be tested:
	divide = require( './../lib/matrix.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'matrix divide', function tests() {

	var out1, out2,
		mat,
		d1,
		d2,
		d3,
		i;

	d1 = new Float64Array( 25 );
	d2 = new Float64Array( 25 );
	d3 = new Float64Array( 25 );
	for ( i = 0; i < d1.length; i++ ) {
		d1[ i ] = i;
		d2[ i ] = i / i;
		d3[ i ] = i * 3;
	}

	beforeEach( function before() {
		mat = matrix( d1, [5,5], 'float64' );
		out1 = matrix( d2, [5,5], 'float64' );
		out2 = matrix( d3, [5,5], 'float64' );
	});

	it( 'should export a function', function test() {
		expect( divide ).to.be.a( 'function' );
	});

	it( 'should throw an error if provided unequal length matrices', function test() {
		expect( badValues ).to.throw( Error );
		function badValues() {
			divide( matrix( [10,10] ), mat, 1 );
		}
	});

	it( 'should throw an error if provided a matrix to be multiplied which is not of equal length to the input matrix', function test() {
		expect( badValues ).to.throw( Error );
		function badValues() {
			divide( matrix( [5,5] ), mat, matrix( [10,10] ) );
		}
	});

	it( 'should divide each matrix element by a scalar', function test() {
		var actual;

		actual = matrix( [5,5], 'float64' );
		actual = divide( actual, mat, 3 );

		assert.deepEqual( actual.data, out2.data );
	});

	it( 'should divide two matrices by each other element-wise', function test() {
		var actual;

		actual = matrix( [5,5], 'float64' );
		actual = divide( actual, mat, mat );

		assert.deepEqual( actual.data, out1.data );
	});

	it( 'should return an empty matrix if provided an empty matrix', function test() {
		var out, mat, expected;

		out = matrix( [0,0] );
		expected = matrix( [0,0] ).data;

		mat = matrix( [0,10] );
		assert.deepEqual( divide( out, mat, 1 ).data, expected );

		mat = matrix( [10,0] );
		assert.deepEqual( divide( out, mat, 1 ).data, expected );

		mat = matrix( [0,0] );
		assert.deepEqual( divide( out, mat, 1 ).data, expected );
	});

});
