// [![Actions Status](https://github.com/bigeasy/ascension/workflows/Node%20CI/badge.svg)](https://github.com/bigeasy/ascension/actions)
// [![codecov](https://codecov.io/gh/bigeasy/ascension/branch/master/graph/badge.svg)](https://codecov.io/gh/bigeasy/ascension)
// [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
//
// A comparator function builder.
//
// | What          | Where                                         |
// | --- | --- |
// | Discussion    | https://github.com/bigeasy/ascension/issues/1 |
// | Documentation | https://bigeasy.github.io/ascension           |
// | Source        | https://github.com/bigeasy/ascension          |
// | Issues        | https://github.com/bigeasy/ascension/issues   |
// | CI            | https://travis-ci.org/bigeasy/ascension       |
// | Coverage:     | https://codecov.io/gh/bigeasy/ascension       |
// | License:      | MIT                                           |
//
// Ascension installs from NPM.

// ## Living `README.md`
//
// This `README.md` is also a unit test using the
// [Proof](https://github.com/bigeasy/proof) unit test framework. We'll use the
// Proof `okay` function to assert out statements in the readme. A Proof unit test
// generally looks like this.

require('proof')(22, okay => {
    // ## Overview

    {
        // Ascension is a comparator function geneator. It generates a comparator suitable
        // for use with
        // [`Array.sort()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort).
        // An `Array.sort()` compatiable comparator compares two values, and returns less
        // than zero if the first value is less than the second, greater than zero if the
        // first value is greater than the second and zero if the two values are equal.
        //
        // Comparator functions are used for ordering throughout the Node.js ecosystem in
        // popular libraries like [`bintrees`](https://github.com/vadimg/js_bintrees). We
        // use Acension to generate comparators for the
        // [Strata](https://bigeasy.com/github/strata)/[Memento](https://bigeasy.com/github/strata)
        // persistent b-tree modules and their supporting modules.
        //
        // I created ascension when I found myself typing out comparator functions
        // repeatedly.

        function comparator (left, right) {
            if (left.length == 0 || right.length == 0) {
                return left.length - right.length
            }
            let compare = left[0] > right[0] ? 1 : left[0] < right[0] ? -1 : 0
            if (compare != 0) {
                return compare
            }
            if (left.length == 1 || right.length == 1) {
                return left.length - right.length
            }
            compare = +left[1] - +right[1]
            if (compare != 0) {
                return compare
            }
            if (left.length == 2 || right.length == 2) {
                return left.length - right.length
            }
            return left[2] > right[2] ? 1 : left[2] < right[2] ? -1 : 0
        }

        // Unit testing a comparator function and obtaining full coverage was as tedious as
        // typing out one of these little monsters.

        okay(comparator([ 'Hello' ], []) > 0, 'empty array')
        okay(comparator([ 'Hello' ], [ 'Hello' ]), 0, 'string part equal')
        okay(comparator([ 'World' ], [ 'Hello' ]) > 0, 'string part greater than')
        okay(comparator([ 'Hello' ], [ 'World' ]) < 0, 'string part less than')
        okay(comparator([ 'Hello', true ], [ 'Hello' ]) > 0, 'only string')
        okay(comparator([ 'Hello', true ], [ 'Hello', false ]) > 0, 'boolean part greater than')
        okay(comparator([ 'Hello', true, 1 ], [ 'Hello', true ]) > 0, 'only string and boolean')
        okay(comparator([ 'Hello', true, 1 ], [ 'Hello', true, 0 ]) > 0, 'number part greater than')
        okay(comparator([ 'Hello', true, 0 ], [ 'Hello', true, 0 ]), 0, 'number part equal')
        okay(comparator([ 'Hello', true, 0 ], [ 'Hello', true, 1 ]) < 0, 'number part less than')

        // We can easily create the same function with Ascension.

        {
            const ascension = require('..')

            const generated = ascension([ String, Boolean, Number ])

            // It is not necessary to unit test this function in as much detail. It should just
            // work because Ascension itself has 100% test coverage.
            //
            // But, it does pass the above tests.

            okay(generated([ 'Hello' ], []) > 0, 'empty array')
            okay(generated([ 'Hello' ], [ 'Hello' ]), 0, 'string part equal')
            okay(generated([ 'World' ], [ 'Hello' ]) > 0, 'string part greater than')
            okay(generated([ 'Hello' ], [ 'World' ]) < 0, 'string part less than')
            okay(generated([ 'Hello', true ], [ 'Hello' ]) > 0, 'only string')
            okay(generated([ 'Hello', true ], [ 'Hello', false ]) > 0, 'boolean part greater than')
            okay(generated([ 'Hello', true, 1 ], [ 'Hello', true ]) > 0, 'only string and boolean')
            okay(generated([ 'Hello', true, 1 ], [ 'Hello', true, 0 ]) > 0, 'number part greater than')
            okay(generated([ 'Hello', true, 0 ], [ 'Hello', true, 0 ]), 0, 'number part equal')
            okay(generated([ 'Hello', true, 0 ], [ 'Hello', true, 1 ]) < 0, 'number part less than')
        }
    }

    // And so I save myself some coding and testing tedium.
    //
    // ## Usage
    //
    // Ascension exports a single function that you can name `ascension`.

    const ascension = require('..')

    {
        const comparator = ascension([ String, Number ])

        okay(comparator([ 'Hello' ], [ 'Hello' ]), 0, 'partial compare equal')
        okay(comparator([ 'Hello', 1 ], [ 'Hello', 1 ]), 0, 'full compare equal')
    }
})

// You can run this unit test yourself to see the output from the various
// code sections of the readme.
