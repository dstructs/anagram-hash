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
	isObject = require( 'validate.io-object' ),
	isBoolean = require( 'validate.io-boolean-primitive' ),
	isStringArray = require( 'validate.io-string-primitive-array' ),
	isPositiveInteger = require( 'validate.io-positive-integer' ),
	typeName = require( 'type-name' );


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
* FUNCTION: ones( len )
*	Creates a 1D array filled with 1s.
*
* @private
* @param {Number} len - array length
* @returns {Number[]} ones array
*/
function ones( len ) {
	var out = new Array( len ),
		i;

	for ( i = 0; i < len; i++ ) {
		out[ i ] = 1;
	}
	return out;
} // end FUNCTION ones()

/**
* FUNCTION: update( hash, getKey, arr )
*	Updates an anagram hash.
*
* @private
* @param {Object} hash - associative array
* @param {Function} getKey - hash function
* @param {String[]} arr - array of strings to add to hash
*/
function update( hash, getKey, arr ) {
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
			key = getKey( str );
		} else {
			key = str;
		}
		// Check if key exists in the hash...
		if ( hash.hasOwnProperty( key ) ) {
			// Key already exists. Determine if we have already seen this string before...
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
* @returns {AnagramHash} new AnagramHash instance
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
		update( this._hash, this.getKey, arr );
	}
	return this;
} // end FUNCTION AnagramHash()

/**
* METHOD: keys( [opts] )
*	Returns a list of hash keys.
*
* @param {Object} [opts] - method options
* @param {Number} [opts.min=1] - minimum number of anagrams which must be associated with a key
* @param {Number} [opts.max=Infinity] - maximum number of anagrams which can be associated with a key
* @returns {String[]} array of keys
*/
AnagramHash.prototype.keys = function( opts ) {
	var hash = this._hash,
		keys = Object.keys( hash ),
		logical,
		min,
		max,
		len,
		out,
		N, i;

	if ( arguments.length ) {
		if ( !isObject( opts ) ) {
			throw new TypeError( 'keys()::invalid input argument. Options must be an object. Value: `' + opts + '`.' );
		}
		if ( opts.hasOwnProperty( 'min' ) ) {
			min = opts.min;
			if ( !isPositiveInteger( min ) ) {
				throw new TypeError( 'keys()::invalid option. `min` option must be a positive integer. Option: `' + min + '`.' );
			}
		} else {
			min = 1;
		}
		if ( opts.hasOwnProperty( 'max' ) ) {
			max = opts.max;
			if ( !isPositiveInteger( max ) ) {
				throw new TypeError( 'keys()::invalid option. `max` option must be a positive integer. Option: `' + max + '`.' );
			}
		} else {
			max = Number.POSITIVE_INFINITY;
		}
		len = keys.length;
		logical = ones( len );
		for ( i = 0; i < len; i++ ) {
			N = hash[ keys[ i ] ].length;
			if ( N < min || N > max ) {
				logical[ i ] = 0;
			}
		}
		out = [];
		for ( i = 0; i < len; i++ ) {
			if ( logical[ i ] ) {
				out.push( keys[ i ] );
			}
		}
		keys = out;
	}
	return keys;
}; // end METHOD keys()

/**
* METHOD: get( [str[, key]] )
*	Returns a list of anagrams. If not provided an input argument, the method returns all anagram lists. If provided a string, the method returns only those anagrams corresponding to the input string which have been already stored in the hash. If provided a key, the method returns all anagrams associated with a particular key.
*
* @param {String} [str] - input string
* @param {Boolean} [key=false] - boolean indicating if an input string should be treated as a hash key
* @returns {Array[]|String[]|null} an array of anagram lists, a single anagram list, or null
*/
AnagramHash.prototype.get = function( str, bool ) {
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
		if ( nargs > 1 ) {
			if ( !isBoolean( bool ) ) {
				throw new TypeError( 'get()::invalid input argument. Key flag must be a boolean primitive. Value: `' + key + '`.' );
			}
			if ( bool ) {
				if ( hash.hasOwnProperty( str ) ) {
					return hash[ str ];
				}
				return null;
			}
		}
		key = this.getKey( str );
		if ( !hash.hasOwnProperty( key ) ) {
			return null;
		}
		list = filter( hash[ key ], str );
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
* METHOD: getKey( str )
*	Creates a hash key from an input string. See [alphagram]{@link http://en.wikipedia.org/wiki/Alphagram}.
*
* @param {String} str - input string
* @returns {String} key - hash key
*/
AnagramHash.prototype.getKey = function( str ) {
	if ( !isString( str ) ) {
		throw new TypeError( 'getKey()::invalid input argument. Must provide a string primitive. Value: `' + str + '`.' );
	}
	// [1] Split the string into separate characters.
	// [2] Sort the characters.
	// [3] Join the sorted characters to create a hash key.
	return str.split( '' )
		.sort( ascending )
		.join( '' );
}; // end METHOD getKey()

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
	arr = new Array( nargs );
	for ( i = 0; i < nargs; i++ ) {
		arr[ i ] = arguments[ i ];
	}
	update( this._hash, this.getKey, arr );
	return this;
}; // end METHOD push()

/**
* METHOD: merge( hash[, hash,...,hash] )
*	Merges other AnagramHash instances into this hash instance.
*
* @param {...AnagramHash} hash - AnagramHash instances
* @returns {AnagramHash} AnagramHash instance
*/
AnagramHash.prototype.merge = function() {
	var nargs = arguments.length,
		mhash,
		hash,
		keys,
		mlist,
		list,
		key,
		len,
		str,
		m, i, j, k;

	for ( i = 0; i < nargs; i++ ) {
		if ( typeName( arguments[ i ] ) !== 'AnagramHash' ) {
			throw new TypeError( 'merge()::invalid input argument. Must provide `AnagramHash` instances. Value: `' + arguments[ i ] + '`.' );
		}
	}
	hash = this._hash;

	// For each hash to be (m)erged...
	for ( i = 0; i < nargs; i++ ) {
		mhash = arguments[ i ]._hash;
		keys = Object.keys( mhash );
		len = keys.length;

		// Loop through each key...
		for ( j = 0; j < len; j++ ) {
			key = keys[ j ];
			mlist = mhash[ key ];
			m = mlist.length;

			// Check if base hash already contains this key...
			if ( hash.hasOwnProperty( key ) ) {
				list = hash[ key ];

				// Only add new anagrams...
				for ( k = 0; k < m; k++ ) {
					str = mlist[ k ];
					if ( !contains( list, str ) ) {
						list.push( str );
					}
				}
			} else {
				// Copy new list of anagrams...
				list = new Array( m );
				for ( k = 0; k < m; k++ ) {
					list[ k ] = mlist[ k ];
				}
				hash[ key ] = list;
			}
		}
	}
	return this;
}; // end METHOD merge()

/**
* METHOD: copy( [keys] )
*	Returns a copy of the hash table.
*
* @param {String[]} [keys] - list of keys to be copied
* @returns {AnagramHash} new AnagramHash instance
*/
AnagramHash.prototype.copy = function( arr ) {
	var nargs = arguments.length,
		hash = this._hash,
		nhash,
		nlist,
		copy,
		list,
		keys,
		key,
		len,
		N, i, j;

	if ( nargs ) {
		if ( !isStringArray( arr ) ) {
			throw new TypeError( 'copy()::invalid input argument. Keys must be a primitive string array. Value: `' + arr + '`.' );
		}
		keys = arr;
	} else {
		keys = Object.keys( hash );
	}
	len = keys.length;

	// Create a (n)ew hash table:
	copy = new AnagramHash();
	nhash = copy._hash;

	// Loop through each key...
	for ( i = 0; i < len; i++ ) {
		key = keys[ i ];
		if ( !hash.hasOwnProperty( key ) ) {
			continue;
		}
		list = hash[ key ];
		N = list.length;

		// Copy the anagrams to the new hash table...
		nlist = new Array( N );
		for ( j = 0; j < N; j++ ) {
			nlist[ j ] = list[ j ];
		}
		nhash[ key ] = nlist;
	}
	return copy;
}; // end METHOD copy()


// EXPORTS //

module.exports = AnagramHash;
