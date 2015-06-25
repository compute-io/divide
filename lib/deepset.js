'use strict';

// MODULES //

var isArrayLike = require( 'validate.io-array-like' ),
	deepSet = require( 'utils-deep-set' ).factory,
	deepGet = require( 'utils-deep-get' ).factory;


// DIVIDE //

/**
* FUNCTION: divide( arr, y, path[, sep] )
*	Computes an element-wise division or each element and deep sets the input array.
*
* @param {Array} arr - input array
* @param {Number[]|Int8Array|Uint8Array|Uint8ClampedArray|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array|Float64Array|Number} y - either an array of equal length or a scalar
* @param {String} path - key path used when deep getting and setting
* @param {String} [sep] - key path separator
* @returns {Array} input array
*/
function divide( x, y, path, sep ) {
	var len = x.length,
		opts = {},
		dget,
		dset,
		v, i,
		yNumeric;

	if ( arguments.length > 3 ) {
		opts.sep = sep;
	}
	if ( len ) {
		dget = deepGet( path, opts );
		dset = deepSet( path, opts );
		if ( isArrayLike( y ) ) {
			for ( i = 0; i < len; i++ ) {
				v = dget( x[ i ] );
				if ( typeof v === 'number' ) {
					dset( x[ i ], v / y[ i ] );
				} else {
					dset( x[ i ], NaN );
				}
			}
		} else {
			yNumeric = ( typeof y === 'number' );
			for ( i = 0; i < len; i++ ) {
				v = dget( x[ i ] );
				if ( yNumeric && typeof v === 'number' ) {
					dset( x[ i ], v / y );
				} else {
					dset( x[ i ], NaN );
				}
			}
		}
	}
	return x;
} // end FUNCTION divide()


// EXPORTS //

module.exports = divide;
