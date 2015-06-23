'use strict';

// MODULES //

var isNumber = require( 'validate.io-number-primitive' ),
	isnan = require( 'validate.io-nan' ),
	isArray = require( 'validate.io-array' ),
	isArrayLike = require( 'validate.io-array-like' ),
	isMatrixLike = require( 'validate.io-matrix-like' ),
	ctors = require( 'compute-array-constructors' ),
	matrix = require( 'dstructs-matrix' ),
	validate = require( './validate.js' );


// FUNCTIONS //

var divide1 = require( './array.js' ),
	divide2 = require( './accessor.js' ),
	divide3 = require( './deepset.js' ),
	divide4 = require( './matrix.js' );


// MULTIPLY //

/**
* FUNCTION: divide( x, y[, opts] )
*	Computes an element-wise division.
*
* @param {Number|Number[]|Array|Int8Array|Uint8Array|Uint8ClampedArray|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array|Float64Array|Matrix} x - input value
* @param {Number|Number[]|Array|Int8Array|Uint8Array|Uint8ClampedArray|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array|Float64Array|Matrix} y - either an array or matrix of equal dimension or a scalar
* @param {Object} [opts] - function options
* @param {Boolean} [opts.copy=true] - boolean indicating if the function should return a new data structure
* @param {Function} [opts.accessor] - accessor function for accessing array values
* @param {String} [opts.path] - deep get/set key path
* @param {String} [opts.sep="."] - deep get/set key path separator
* @param {String} [opts.dtype="float64"] - output data type
* @returns {Number|Number[]|Array|Int8Array|Uint8Array|Uint8ClampedArray|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array|Float64Array|Matrix} value(s) after division
*/
function divide( x, y, options ) {
	/* jshint newcap:false */
	var opts = {},
		ctor,
		err,
		out,
		dt,
		d;
	if ( isNumber( x ) || isnan( x ) ) {
		if ( !isNumber( y ) ) {
			throw new TypeError( 'divide()::invalid input argument. Second argument must a number primitive when x is a number. Value: `' + x + '`.' );
		}
		return x / y;
	}
	if ( arguments.length > 2 ) {
		err = validate( opts, options );
		if ( err ) {
			throw err;
		}
	}
	if ( isMatrixLike( x ) ) {
		if ( !isMatrixLike( y ) && !isNumber( y ) ) {
			throw new TypeError( 'divide()::invalid input argument. Second argument must be matrix-like or a number primitive when x is a matrix. Value: `' + x + '`.' );
		}
		if ( opts.copy !== false ) {
			dt = opts.dtype || 'float64';
			ctor = ctors( dt );
			if ( ctor === null ) {
				throw new Error( 'divide()::invalid option. Data type option does not have a corresponding array constructor. Option: `' + dt + '`.' );
			}
			// Create an output matrix:
			d = new ctor( x.length );
			out = matrix( d, x.shape, dt );
		} else {
			out = x;
		}
		return divide4( out, x, y );
	}
	if ( isArrayLike( x ) ) {
		if ( !isArrayLike( y ) && !isNumber( y ) ) {
			throw new TypeError( 'divide()::invalid input argument. Second argument must be array-like or a number primitive when x is an array. Value: `' + x + '`.' );
		}
		// Handle deepset first...
		if ( opts.path ) {
			opts.sep = opts.sep || '.';
			return divide3( x, y, opts.path, opts.sep );
		}
		// Handle regular, typed, and accessor arrays next...
		if ( opts.copy === false ) {
			out = x;
		}
		else if ( opts.dtype || !isArray( x ) ) {
			dt = opts.dtype || 'float64';
			ctor = ctors( dt );
			if ( ctor === null ) {
				throw new TypeError( 'divide()::invalid input argument. Unrecognized/unsupported array-like object. Provide either a plain or typed array. Value: `' + x + '`.' );
			}
			out = new ctor( x.length );
		}
		else {
			out = new Array( x.length );
		}
		if ( opts.accessor ) {
			return divide2( out, x, y, opts.accessor );
		}
		return divide1( out, x, y );
	}
	return NaN;
} // end FUNCTION divide()


// EXPORTS //

module.exports = divide;
