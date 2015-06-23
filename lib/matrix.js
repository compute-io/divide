'use strict';

// MODULES //

var isMatrixLike = require( 'validate.io-matrix-like' );


// DIVIDE //

/**
* FUNCTION: divide( out, x, y )
*	Computes an element-wise multiplication of a matrix
*
* @param {Matrix} out - output matirx
* @param {Matrix} x - input matrix
* @param {Matrix|Number} y - either a matrix of equal dimensions or a scalar
* @returns {Matrix} output matrix
*/
function divide( out, x, y ) {
	var len = x.length,
		i, j,
		M, N;

	if ( out.length !== len ) {
		throw new Error( 'divide()::invalid input arguments. Input and output matrices must be the same length.' );
	}
	if ( isMatrixLike( y ) ) {
		M = x.shape[0];
		N = x.shape[1];
		if ( M !== x.shape[0] || N !== y.shape[1] ) {
			throw new Error( 'divide()::invalid input arguments. Matrix to be multiplied must have the same number of rows and columns as the input matrix.' );
		}
		for ( i = 0; i < M; i++ ) {
			for ( j = 0; j < N; j++ ) {
				out.set( i, j, x.get( i, j ) * y.get( i, j ) );
			}
		}
	} else {
		for ( i = 0; i < len; i++ ) {
			out.data[ i ] = x.data[ i ] * y;
		}
	}
	return out;
} // end FUNCTION divide()


// EXPORTS //

module.exports = divide;
