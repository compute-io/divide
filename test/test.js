'use strict';

// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Module to be tested:
	divide = require( './../lib' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'compute-divide', function tests() {

	it( 'should export a function', function test() {
		expect( divide ).to.be.a( 'function' );
	});

	it( 'should throw an error if provided a non-array', function test() {
		var values = [
				5,
				'5',
				{},
				true,
				null,
				undefined,
				NaN,
				function(){}
			];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( TypeError );
		}

		function badValue( value ) {
			return function() {
				divide( value, 0 );
			};
		}
	});

	it( 'should throw an error if not provided an array or number for the second argument', function test() {
		var values = [
				'5',
				{},
				true,
				null,
				undefined,
				NaN,
				function(){}
			];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( TypeError );
		}

		function badValue( value ) {
			return function() {
				divide( [], value );
			};
		}
	});

	it( 'should throw an error if provided arrays of unequal length', function test() {
		expect( foo ).to.throw( Error );
		function foo() {
			divide( [1,2], [1,2,3] );
		}
	});

	it( 'should perform element-wise division', function test() {
		var data, expected;

		data = [ 5, 2, 4, 1, 2 ];
		expected = [ 5/4, 0.5, 1, 0.25, 0.5 ];

		divide( data, 4 );
		assert.deepEqual( data, expected );

		data = [ 5, 2, 4, 1, 2 ];
		expected = [ 1, 1, 1, 1, 2 ];

		divide( data, [5,2,4,1,1] );
		assert.deepEqual( data, expected );
	});

});
