/**
*
*	COMPUTE: anagram-hash
*
*
*	DESCRIPTION:
*		- Anagram hash table.
*
*
*	NOTES:
*		[1]
*
*
*	TODO:
*		[1]
*
*
*	LICENSE:
*		MIT
*
*	Copyright (c) 2015. Athan Reines.
*
*
*	AUTHOR:
*		Athan Reines. kgryte@gmail.com. 2015.
*
*/

'use strict';

// MODULES //

var isString = require( 'validate.io-string-primitive' ),
	isStringArray = require( 'validate.io-string-primitive-array' );


// FUNCTIONS //

/**
* FUNCTION: ascending( a, b )
*	Comparator function for sorting characters in ascending order.
*
* @private
* @param {String} a - character
* @param {String} b - character
* @returns {Number} comparison value
*/
function ascending( a, b ) {
	if ( a < b ) {
		return -1;
	}
	if ( a === b ) {
		return 0;
	}
	return 1;
} // end FUNCTION ascending()

/**
* FUNCTION: contains( arr, str )
*	Validates if an array contains an input string.
*
* @private
* @param {Array} arr - search array
* @param {String} str - search string
* @returns {Boolean} boolean indicating if an array contains an input string
*/
function contains( arr, str ) {
	var len = arr.length,
		i;

	for ( i = 0; i < len; i++ ) {
		if ( arr[ i ] === str ) {
			return true;
		}
	}
	return false;
} // end FUNCTION contains()

/**
* FUNCTION: filter( arr, str )
*	Removes a string from an array.
*
* @private
* @param {Array} arr - search array
* @param {String} str - search string
* @returns {Array} filtered array
*/
function filter( arr, str ) {
	var len = arr.length,
		out = [],
		i;

	for ( i = 0; i < len; i++ ) {
		if ( arr[ i ] !== str ) {
			out.push( arr[ i ] );
		}
	}
	return out;
} // end FUNCTION filter()

/**
* FUNCTION: createKey( str )
*	Creates a hash key from an input string. See [alphagram]{@link http://en.wikipedia.org/wiki/Alphagram}.
*
* @private
* @param {String} str - input string
* @returns {String} key - hash key
*/
function createKey( str ) {
	// [1] Split the string into separate characters.
	// [2] Sort the characters.
	// [3] Join the sorted characters to create a hash key.
	return str.split( '' )
		.sort( ascending )
		.join( '' );
} // end FUNCTION createKey()

/**
* FUNCTION: update( hash, arr )
*	Updates an anagram hash.
*
* @private
* @param {Object} hash - associative array
* @param {String[]} arr - array of strings to add to hash
*/
function update( hash, arr ) {
	var list,
		str,
		key,
		len,
		i;

	len = arr.length;
	for ( i = 0; i < len; i++ ) {
		str = arr[ i ];

		// Create a hash key...
		if ( str.length > 1 ) {
			key = createKey( str );
		} else {
			key = str;
		}
		// Check if key exists in the hash...
		if ( hash.hasOwnProperty( key ) ) {
			// Key already exists. Determine we have already seen this string before...
			list = hash[ key ];
			if ( !contains( list, str ) ) {
				list.push ( str );
			}
		} else {
			hash[ key ] = [ str ];
		}
	}
} // end FUNCTION update()


// ANAGRAM HASH TABLE //

/**
* FUNCTION: AnagramHash( [arr] )
*	Hash table constructor.
*
* @param {String[]} [arr] - initial string array
* @returns {AnagramHash} new Anagram Hash instance
*/
function AnagramHash( arr ) {
	var nargs = arguments.length;
	if ( !( this instanceof AnagramHash ) ) {
		if ( nargs ) {
			return new AnagramHash( arr );
		} else {
			return new AnagramHash();
		}
	}
	if ( nargs && !isStringArray( arr ) ) {
		throw new TypeError( 'AnagramHash()::invalid input argument. Must provide an array of string primitives. Value: `' + arr + '`.' );
	}
	this._hash = {};
	if ( nargs ) {
		update( this._hash, arr );
	}
	return this;
} // end FUNCTION AnagramHash()

/**
* METHOD: get( [str] )
*	Returns a list of anagrams. If not provided an input argument, the method returns all anagram lists. If provided a string, the method returns only those anagrams corresponding to the input string which have been already stored in the hash.
*
* @param {String} [str] - input string
* @returns {Array[]|String[]|null} an array of anagram lists, a single anagram list, or null
*/
AnagramHash.prototype.get = function( str ) {
	var nargs = arguments.length,
		hash = this._hash,
		keys,
		list,
		key,
		out,
		tmp,
		len,
		n, i, j;

	if ( nargs ) {
		if ( !isString( str ) ) {
			throw new TypeError( 'get()::invalid input argument. Must provide a string primitive. Value: `' + str + '`.' );
		}
		key = createKey( str );
		list = hash[ key ];
		if ( !list ) {
			return null;
		}
		list = filter( list, str );
		if ( list.length ) {
			return list;
		}
		return null;
	}
	// NOTE: possible optimization. Cache the keys. Would require additional management. Not sure if it is worth it.
	keys = Object.keys( hash );

	len = keys.length;
	out = [];
	for ( i = 0; i < len; i++ ) {
		list = hash[ keys[i] ];
		n = list.length;
		if ( n > 1 ) {
			// Perform a copy to prevent tampering...
			tmp = new Array( n );
			for ( j = 0; j < n; j++ ) {
				tmp[ j ] = list[ j ];
			}
			out.push( tmp );
		}
	}
	return ( out.length ) ? out : null;
}; // end METHOD get()

/**
* METHOD: push( str[, str,...] )
*	Adds strings to the anagram hash table.
*
* @param {...String} str - strings to add
* @returns {AnagramHash} AnagramHash instance
*/
AnagramHash.prototype.push = function() {
	var nargs = arguments.length,
		arr,
		i;
	for ( i = 0; i < nargs; i++ ) {
		if ( !isString( arguments[i] ) ) {
			throw new TypeError( 'push()::invalid input argument. Must provide string primitives. Value: `' + arguments[ i ] );
		}
	}
	arr = [];
	for ( i = 0; i < nargs; i++ ) {
		arr.push( arguments[ i ] );
	}
	update( this._hash, arr );
	return this;
}; // end METHOD push()


// EXPORTS //

module.exports = AnagramHash;
