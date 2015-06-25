/* global require, describe, it */
'use strict';

// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Matrix data structure:
	matrix = require( 'dstructs-matrix' ),

	// Validate if a value is NaN:
	isnan = require( 'validate.io-nan' ),

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

	it( 'should throw an error if provided an invalid option', function test() {
		var values = [
			'5',
			5,
			true,
			undefined,
			null,
			NaN,
			[],
			{}
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( TypeError );
		}
		function badValue( value ) {
			return function() {
				divide( [1,2,3], 1, {
					'accessor': value
				});
			};
		}
	});

	it( 'should throw an error if provided an array and an unrecognized/unsupported data type option', function test() {
		var values = [
			'beep',
			'boop'
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( Error );
		}
		function badValue( value ) {
			return function() {
				divide( [1,2,3], 1, {
					'dtype': value
				});
			};
		}
	});

	it( 'should throw an error if provided a matrix and an unrecognized/unsupported data type option', function test() {
		var values = [
			'beep',
			'boop'
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( Error );
		}
		function badValue( value ) {
			return function() {
				divide( matrix( [2,2] ), 1, {
					'dtype': value
				});
			};
		}
	});

	it( 'should throw an error if provided a number as the first argument and an not applicable option', function test() {
		var values = [
			{'accessor': function getValue( d ) { return d; } },
			{'copy': false},
			{'path': 'x'},
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( Error );
		}
		function badValue( value ) {
			return function() {
				divide( 12, [1,2,3], value );
			};
		}
	});

	it( 'should return NaN if the first argument is neither a number, array-like, or matrix-like', function test() {
		var values = [
			// '5', // valid as is array-like (length)
			true,
			undefined,
			null,
			NaN,
			function(){},
			{}
		];

		for ( var i = 0; i < values.length; i++ ) {
			assert.isTrue( isnan( divide( values[ i ], 1 ) ) );
		}
	});


	it( 'should return NaN if the first argument is a number and the second argument is neither numberic, array-like, or matrix-like', function test() {
		var values = [
			// '5', // valid as is array-like (length)
			true,
			undefined,
			null,
			NaN,
			function(){},
			{}
		];

		for ( var i = 0; i < values.length; i++ ) {
			assert.isTrue( isnan( divide( 8, values[ i ] ) ) );
		}
	});

	it( 'should divide two numbers', function test() {
		assert.strictEqual( divide( 3, 2 ), 1.5 );
		assert.strictEqual( divide( 20, 10  ), 2 );
	});

	it( 'should calculate the division of a scalar by an array', function test() {
		var data, actual, expected;
		data = [ 1, 2 ];
		actual = divide( 4, data );
		expected = [ 4, 2 ];
		assert.deepEqual( actual, expected );
	});

	it( 'should calculate the division of a scalar by an array and cast result to a different dtype', function test() {
		var data, actual, expected;
		data = [ 1, 2 ];
		actual = divide( 10, data, {
			'dtype':'int32'
		});
		expected = new Int32Array( [10,5] );
		assert.deepEqual( actual, expected );
	});

	it( 'should calculate the division of a scalar by a matrix', function test() {
		var data, actual, expected;
		data = matrix( new Int8Array( [ 1,2,3,4 ] ), [2,2] );
		actual = divide( 12, data );
		expected = matrix( new Float64Array( [12,6,4,3] ), [2,2] );

		assert.deepEqual( actual.data, expected.data );
	});

	it( 'should calculate the division of a scalar by a matrix and cast to a different dtype', function test() {
		var data, actual, expected;
		data = matrix( new Int8Array( [ 1,2,3,4 ] ), [2,2] );
		actual = divide( 12, data, {
			'dtype': 'int32'
		});
		expected = matrix( new Int32Array( [12,6,4,3] ), [2,2] );

		assert.strictEqual( actual.dtype, 'int32' );
		assert.deepEqual( actual.data, expected.data );
	});

	it( 'should perform an element-wise division when provided a plain array and a scalar', function test() {
		var data, actual, expected;

		data = [ 0, 1, 2, 3 ];
		expected = [
			0,
			2,
			4,
			6
		];

		actual = divide( data, 0.5 );
		assert.notEqual( actual, data );

		assert.deepEqual( actual, expected );

		// Mutate...
		actual = divide( data, 0.5, {
			'copy': false
		});
		assert.strictEqual( actual, data );

		assert.deepEqual( data, expected );

	});

	it( 'should perform an element-wise division when provided a plain array and another array', function test() {
		var data, actual, expected;

		data = [ 0, 1, 2, 3 ];
		expected = [
			NaN,
			1,
			1,
			1
		];

		actual = divide( data, data );
		assert.notEqual( actual, data );

		assert.deepEqual( actual, expected );

		// Mutate...
		actual = divide( data, data, {
			'copy': false
		});
		assert.strictEqual( actual, data );

		assert.deepEqual( data, expected );

	});

	it( 'should perform an element-wise division when provided a typed array and a scalar', function test() {
		var data, actual, expected;

		data = new Int8Array( [ 0, 1, 2, 3 ] );

		expected = new Float64Array( [
			0,
			0.5,
			1,
			1.5
		]);

		actual = divide( data, 2 );
		assert.notEqual( actual, data );

		assert.deepEqual( actual, expected );

		// Mutate:
		actual = divide( data, 2, {
			'copy': false
		});
		assert.strictEqual( actual, data );
		expected = new Int8Array( [ 0, 0, 1, 1 ] );

		assert.deepEqual( data, expected );
	});

	it( 'should perform an element-wise division when provided a typed array and another typed array', function test() {
		var data, actual, expected;

		data = new Int8Array( [ 3, 6, 9, 12 ] );

		expected = new Float64Array( [
			1,
			1,
			1,
			1
		]);

		actual = divide( data, data );
		assert.notEqual( actual, data );
		assert.deepEqual( actual, expected );

		// Mutate:

		actual = divide( data, data, {
			'copy': false
		});
		expected = new Int8Array( [ 1, 1, 1, 1 ] );
		assert.strictEqual( actual, data );

		assert.deepEqual( data, expected );
	});

	it( 'should perform an element-wise division and return an array of a specific type', function test() {
		var data, actual, expected;

		data = [ 0, 4, 8, 12 ];
		expected = new Int8Array( [ 0, 1, 2, 3 ] );

		actual = divide( data, 4, {
			'dtype': 'int8'
		});
		assert.notEqual( actual, data );
		assert.strictEqual( actual.BYTES_PER_ELEMENT, 1 );
		assert.deepEqual( actual, expected );
	});

	it( 'should perform an element-wise division with a scalar using an accessor', function test() {
		var data, actual, expected;

		data = [
			[3,0],
			[4,1],
			[5,2],
			[6,3]
		];

		expected = [
			0,
			0.5,
			1,
			1.5
		];

		actual = divide( data, 2, {
			'accessor': getValue
		});
		assert.notEqual( actual, data );

		assert.deepEqual( actual, expected );

		// Mutate:
		actual = divide( data, 2, {
			'accessor': getValue,
			'copy': false
		});
		assert.strictEqual( actual, data );

		assert.deepEqual( data, expected );

		function getValue( d ) {
			return d[ 1 ];
		}
	});

	it( 'should perform an element-wise division two object arrays using an accessor', function test() {
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

		actual = divide( data, y, {
			'accessor': getValue
		});

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

	it( 'should perform an element-wise division with a scalar and deep set', function test() {
		var data, actual, expected, i;

		data = [
			{'x':[3,0]},
			{'x':[4,3]},
			{'x':[5,6]},
			{'x':[6,9]}
		];
		expected = [
			{'x':[3,0]},
			{'x':[4,1]},
			{'x':[5,2]},
			{'x':[6,3]}
		];

		actual = divide( data, 3, {
			'path': 'x.1'
		});

		assert.strictEqual( actual, data );

		for ( i = 0; i < data.length; i++ ) {
			assert.closeTo( actual[ i ].x[ 1 ], expected[ i ].x[ 1 ], 1e-6 );
		}

		// Specify a path with a custom separator...
		data = [
			{'x':[3,0]},
			{'x':[4,3]},
			{'x':[5,6]},
			{'x':[6,9]}
		];
		actual = divide( data, 3, {
			'path': 'x/1',
			'sep': '/'
		});
		assert.strictEqual( actual, data );

		for ( i = 0; i < data.length; i++ ) {
			assert.closeTo( actual[ i ].x[ 1 ], expected[ i ].x[ 1 ], 1e-6 );
		}
	});

	it( 'should perform an element-wise division using an array and deep set', function test() {
		var data, actual, expected, y;

		data = [
			{'x':6},
			{'x':3},
			{'x':2},
			{'x':1}
		];

		y = [ 6, 3, 2, 1 ];

		actual = divide( data, y, {
			path: 'x'
		});

		expected = [
			{'x':1},
			{'x':1},
			{'x':1},
			{'x':1}
		];

		assert.strictEqual( data, actual );
		assert.deepEqual( data, expected);

		// Custom separator...
		data = [
			{'x':[9,6]},
			{'x':[9,3]},
			{'x':[9,2]},
			{'x':[9,1]}
		];

		data = divide( data, y, {
			'path': 'x/1',
			'sep': '/'
		});
		expected = [
			{'x':[9,1]},
			{'x':[9,1]},
			{'x':[9,1]},
			{'x':[9,1]}
		];

		assert.deepEqual( data, expected, 'custom separator' );
	});

	it( 'should perform an element-wise division when provided a matrix', function test() {
		var mat,
			out,
			d1,
			d2,
			d3,
			i;

		d1 = new Int32Array( 100 );
		d2 = new Int32Array( 100 );
		d3 = new Int32Array( 100 );
		for ( i = 0; i < d1.length; i++ ) {
			d1[ i ] = ( i + 1 );
			d2[ i ] = ( i + 1) / ( i + 1);
			d3[ i ] = ( i + 1) / 2;
		}

		// Divide matrix by scalar
		mat = matrix( d1, [10,10], 'int32' );
		out = divide( mat, 2, {
			'dtype': 'int32'
		});

		assert.deepEqual( out.data, d3 );

		// Divide two matrices element-wise
		mat = matrix( d1, [10,10], 'int32' );
		out = divide( mat, mat, {
			'dtype': 'int32'
		});

		assert.deepEqual( out.data, d2 );

		// Multiply matrix by scalar and mutate...
		out = divide( mat, 2, {
			'copy': false
		});

		assert.strictEqual( mat, out );
		assert.deepEqual( mat.data, d3 );
	});

	it( 'should perform an element-wise division by a scalar and return a matrix of a specific type', function test() {
		var mat,
			out,
			d1,
			d2,
			i;

		d1 = new Int16Array( 100 );
		d2 = new Uint16Array( 100 );
		for ( i = 0; i < d1.length; i++ ) {
			d1[ i ] = i;
			d2[ i ] = i / 2;
		}
		mat = matrix( d1, [10,10], 'int16' );
		out = divide( mat, 2, {
			'dtype': 'uint16'
		});

		assert.strictEqual( out.dtype, 'uint16' );
		assert.deepEqual( out.data, d2 );
	});

	it( 'should return an empty data structure if provided an empty data structure', function test() {
		assert.deepEqual( divide( [], 1 ), [] );
		assert.deepEqual( divide( matrix( [0,0] ), 1 ).data, matrix( [0,0] ).data );
		assert.deepEqual( divide( new Int8Array(), 1 ), new Float64Array() );
	});

});
