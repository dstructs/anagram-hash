/* global require, describe, it, beforeEach */
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

	var words, hash;

	words = [
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

	beforeEach( function before() {
		hash = createHash( words );
	});


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

	describe( 'hash#keys', function tests() {

		it( 'should provide a method to get the hash keys', function test() {
			expect( hash.keys ).to.be.a( 'function' );
		});

		it( 'should throw an error if provided a non-object', function test() {
			var values = [
				5,
				null,
				undefined,
				NaN,
				true,
				'5',
				[],
				function(){}
			];

			for ( var i = 0; i < values.length; i++ ) {
				expect( badValue( values[i] ) ).to.throw( TypeError );
			}
			function badValue( value ) {
				return function() {
					hash.keys( value );
				};
			}
		});

		it( 'should throw an error if provided a min option which is not a positive integer', function test() {
			var values = [
				'5',
				Math.PI,
				-1,
				0,
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
					hash.keys({ 'min': value });
				};
			}
		});

		it( 'should throw an error if provided a max option which is not a positive integer', function test() {
			var values = [
				'5',
				Math.PI,
				-1,
				0,
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
					hash.keys({ 'max': value });
				};
			}
		});

		it( 'should return a list of keys', function test() {
			var hash, actual, expected;

			hash = createHash( ['oof','woot'] );

			actual = hash.keys();
			expected = ['foo','ootw'];

			assert.deepEqual( actual, expected );
		});

		it( 'should return a list of keys having a minimum number of associated anagrams', function test() {
			var hash, actual, expected;

			hash = createHash( ['oof','woot','foo','beep'] );

			actual = hash.keys({ 'min': 2 });
			expected = ['foo'];

			assert.deepEqual( actual, expected );
		});

		it( 'should return a list of keys having a maximum number of associated anagrams', function test() {
			var hash, actual, expected;

			hash = createHash( ['beep','oof','woot','foo'] );

			actual = hash.keys({ 'max': 1 });
			expected = ['beep', 'ootw'];

			assert.deepEqual( actual, expected );
		});

		it( 'should return an empty array if no keys meet criteria', function test() {
			var hash, actual, expected;

			hash = createHash( ['oof','woot','foo','beep'] );

			actual = hash.keys({ 'min': 999 });
			expected = [];

			assert.deepEqual( actual, expected );
		});

	}); // end TESTS keys

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

		it( 'should throw an error if provided a non-boolean key flag', function test() {
			var values = [
				5,
				null,
				undefined,
				NaN,
				'5',
				{},
				[],
				function(){}
			];

			for ( var i = 0; i < values.length; i++ ) {
				expect( badValue( values[i] ) ).to.throw( TypeError );
			}
			function badValue( value ) {
				return function() {
					hash.get( 'beep', value );
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

			actual = hash.get( 'bat', false );
			expected = ['tab'];

			assert.deepEqual( actual, expected );
		});

		it( 'should return all anagrams associated with a key', function test() {
			var actual, expected;

			actual = hash.get( 'abt', true );
			expected = ['bat','tab'];

			assert.deepEqual( actual, expected );

			actual = hash.get( 'beep', true );
			expected = ['beep'];

			assert.deepEqual( actual, expected );
		});

		it( 'should return null if the hash does not contain any anagram sets', function test() {
			var hash = createHash( ['beep'] );

			assert.isNull( hash.get() );
			assert.isNull( hash.get( 'bat' ) );
			assert.isNull( hash.get( 'beep' ) );
			assert.isNull( hash.get( 'abcdef', true ) );
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

	describe( 'hash#merge', function tests() {

		it( 'should provide a method to merge hashes', function test() {
			expect( hash.merge ).to.be.a( 'function' );
		});

		it( 'should throw an error if provided anything other than AnagramHash instances', function test() {
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
				new Function(),
				new Date(),
				new RegExp()
			];

			for ( var i = 0; i < values.length; i++ ) {
				expect( badValue( values[i] ) ).to.throw( TypeError );
			}
			function badValue( value ) {
				return function() {
					hash.merge( value );
				};
			}
		});

		it( 'should merge hashes', function test() {
			var mhash, actual, expected;

			mhash = createHash( ['yes', 'no', 'beep', 'bepe' ] );

			hash.merge( mhash );

			// Previously non-existing key:
			actual = hash.get( 'no', true );
			expected = ['no'];

			assert.deepEqual( actual, expected );

			// Previously existing key:
			actual = hash.get( 'beep', true );
			expected = ['beep', 'bepe'];

			assert.deepEqual( actual, expected );
		});

		it( 'should merge multiple hashes', function test() {
			var mhash1, mhash2, actual, expected;

			mhash1 = createHash( ['yes', 'no' ] );
			mhash2 = createHash( ['beep', 'bepe' ] );

			hash.merge( mhash1, mhash2 );

			// Previously non-existing key:
			actual = hash.get( 'no', true );
			expected = ['no'];

			assert.deepEqual( actual, expected );

			// Previously existing key:
			actual = hash.get( 'beep', true );
			expected = ['beep', 'bepe'];

			assert.deepEqual( actual, expected );
		});

	}); // end TESTS merge

});
