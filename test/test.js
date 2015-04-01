/* global require, describe, it */
'use strict';

// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Module to be tested:
	createHash = require( './../lib' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'compute-anagram-hash', function tests() {

	// SETUP //

	var words = [
		'beep',
		'boop',
		'bop',
		'bap',
		'foo',
		'bar',
		'cat',
		'bat',
		'moot',
		'woot',
		'moto',
		'tab',
		'pad',
		'bat'
	];

	var hash = createHash( words );


	// TESTS //

	it( 'should export a function', function test() {
		expect( createHash ).to.be.a( 'function' );
	});

	it( 'should export a constructor', function test() {
		assert.ok( new createHash() instanceof createHash );
	});

	it( 'should not require the `new` operator', function test() {
		assert.ok( createHash() instanceof createHash );
		assert.ok( createHash( ['a','b'] ) instanceof createHash );
	});

	it( 'should throw an error if provided a non-string array', function test() {
		var values = [
			'5',
			5,
			null,
			undefined,
			NaN,
			true,
			{},
			[],
			function(){},
			['a',null],
			['a',5],
			['a', new String('b') ]
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( TypeError );
		}
		function badValue( value ) {
			return function() {
				createHash( value );
			};
		}
	});

	describe( 'hash#get', function tests() {

		it( 'should provide a method to return a list of anagrams', function test() {
			expect( hash.get ).to.be.a( 'function' );
		});

		it( 'should throw an error if provided a non-string', function test() {
			var values = [
				5,
				null,
				undefined,
				NaN,
				true,
				{},
				[],
				function(){}
			];

			for ( var i = 0; i < values.length; i++ ) {
				expect( badValue( values[i] ) ).to.throw( TypeError );
			}
			function badValue( value ) {
				return function() {
					hash.get( value );
				};
			}
		});

		it( 'should return all anagrams', function test() {
			var actual, expected;

			actual = hash.get();
			expected = [['bat','tab'],['moot','moto']];

			assert.deepEqual( actual, expected );
		});

		it( 'should any matching anagrams', function test() {
			var actual, expected;

			actual = hash.get( 'bat' );
			expected = ['tab'];

			assert.deepEqual( actual, expected );
		});

		it( 'should return null if the hash does not contain any anagram sets', function test() {
			var hash = createHash( ['beep'] );

			assert.isNull( hash.get() );
			assert.isNull( hash.get( 'bat' ) );
			assert.isNull( hash.get( 'beep' ) );
		});

	}); // end TESTS get

	describe( 'hash#getKey', function tests() {

		it( 'should provide a method to create a hash key', function test() {
			expect( hash.getKey ).to.be.a( 'function' );
		});

		it( 'should throw an error if provided a non-string', function test() {
			var values = [
				5,
				null,
				undefined,
				NaN,
				true,
				{},
				[],
				function(){}
			];

			for ( var i = 0; i < values.length; i++ ) {
				expect( badValue( values[i] ) ).to.throw( TypeError );
			}
			function badValue( value ) {
				return function() {
					hash.getKey( value );
				};
			}
		});

		it( 'should return an alphagram', function test() {
			var actual, expected;

			actual = hash.getKey( 'tab' );
			expected = 'abt';

			assert.strictEqual( actual, expected );
		});

	}); // end TESTS getKey

	describe( 'hash#push', function tests() {

		it( 'should provide a method to add strings to the hash', function test() {
			expect( hash.push ).to.be.a( 'function' );
		});

		it( 'should throw an error if provided a non-string', function test() {
			var values = [
				5,
				null,
				undefined,
				NaN,
				true,
				{},
				[],
				function(){}
			];

			for ( var i = 0; i < values.length; i++ ) {
				expect( badValue1( values[i] ) ).to.throw( TypeError );
				expect( badValue2( values[i] ) ).to.throw( TypeError );
			}
			function badValue1( value ) {
				return function() {
					hash.push( value );
				};
			}
			function badValue2( value ) {
				return function() {
					hash.push( 'beep', value );
				};
			}
		});

		it( 'should add strings to the hash', function test() {
			var hash = createHash();

			hash.push( 'beep' );
			hash.push( 'peeb' );
			assert.deepEqual( hash.get(), [['beep','peeb']] );

			hash.push( 'dog', 'god' );
			assert.deepEqual( hash.get( 'dog' ), ['god'] );
		});

	}); // end TESTS push

});
