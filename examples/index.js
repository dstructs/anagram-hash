'use strict';

var createHash = require( './../lib' );

// Load a string array containing tokenized words:
var words = require( './words.json' );

// Create a new hash:
var hash = createHash( words );

// Get all anagram lists:
var lists = hash.get();
console.log( lists );

// Get a single anagram list:
var list = hash.get( 'rome' );
console.log( list );

