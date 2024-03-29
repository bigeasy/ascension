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

require('proof')(87, okay => {
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

    // Where the above arguments are...
    //
    //  * `Type` &mdash; Comparator type. One of `String`, `Number`, `Boolean` or
    //    `BigInt`.
    //  * `direction` &mdash; Either `1` for ascending or `-1` for descending.
    //  * `comparator` &mdash; An existing comparator function.
    //
    // The `ascension` creates either scalar comparators that compare two values of a
    // single type or array comparators that compare an array of values with where the
    // type is specified by the position in the array.

    const ascension = require('..')

    // To create a scalar comparator you specify the type as JavaScript class name of
    // type you wish to compare.

    {
        const comparator = ascension(String)

        okay(comparator('a', 'b') < 0, 'string less than')
        okay(comparator('b', 'a') > 0, 'string greater than')
        okay(comparator('a', 'a'), 0, 'string equal')

        okay(comparator('1', 1), 0, 'string equal coalesceed')

        const storted = [ 'b', 'c', 'a' ].sort(comparator)
        okay(storted, [ 'a', 'b', 'c' ], 'string sorted')
    }

    // You can create a comparator that reverses the comparison by using a direction
    // argument whose value is `-1`. When used used with a `Array.sort()` it sorts
    // descending a reversed comparator will sort descending.

    {
        const comparator = ascension(String, -1)

        okay(comparator('a', 'b') > 0, 'string less than reversed')
        okay(comparator('b', 'a') < 0, 'string greater than reversed')
        okay(comparator('a', 'a'), 0, 'string equal reversed')

        okay(comparator('1', 1), 0, 'string equal reversed coalesceed')

        const storted = [ 'b', 'c', 'a' ].sort(comparator)
        okay(storted, [ 'c', 'b', 'a' ], 'string sorted reversed')
    }

    // You can specify a direction argument as either `-1` for descending or `1` for
    // ascending. `1` ascending is the default.

    {
        const comparator = ascension(String)

        okay(comparator('a', 'b') < 0, 'string less than explicit forward')
        okay(comparator('b', 'a') > 0, 'string greater than explicit forward')
        okay(comparator('a', 'a'), 0, 'string equal explicit forward')

        okay(comparator('1', 1), 0, 'string equal explicit forward coalesceed')

        const storted = [ 'b', 'c', 'a' ].sort(comparator)
        okay(storted, [ 'a', 'b', 'c' ], 'string sorted explicit forward')
    }

    // You can specify a numeric comparision with an argument of the JavaScript
    // `Number` type.

    {
        const comparator = ascension(Number)

        okay(comparator(0, 1) < 0, 'number less than')
        okay(comparator(1, 0) > 0, 'number greater than')
        okay(comparator(1, 1), 0, 'number equal')

        okay(comparator('1', 1), 0, 'number equal coalesced')

        const storted = [ 2, 0, 1 ].sort(comparator)
        okay(storted, [ 0, 1, 2 ], 'number sorted')
    }

    // You can specify a boolean comparision with an argument of the JavaScript
    // `Boolean` type.

    {
        const comparator = ascension(Boolean)

        okay(comparator(false, true) < 0, 'boolean less than')
        okay(comparator(true, false) > 0, 'boolean greater than')
        okay(comparator(true, true), 0, 'boolean equal')

        okay(comparator(0, false), 0, 'boolean equal coalesced')

        const storted = [ true, false ].sort(comparator)
        okay(storted, [ false, true ], 'boolean sorted')
    }

    // You can specify a `BigInt` comparision with an argument of the JavaScript
    // `BigInt` type.

    {
        const comparator = ascension(BigInt)

        okay(comparator(0n, 1n) < 0, 'bigint less than')
        okay(comparator(1n, 0n) > 0, 'bigint greater than')
        okay(comparator(0n, 0n), 0, 'bigint equal')

        const storted = [ 1n, 2n, 0n ].sort(comparator)
        okay(storted, [ 0n, 1n, 2n ], 'bigint sorted')
    }

    // You can create a reversed comparator of any of the above types.

    {
        const comparator = ascension(Number, -1)

        okay(comparator(1, 0) < 0, 'number less than reversed')
        okay(comparator(0, 1) > 0, 'number greater than reversed')
        okay(comparator(0, 0), 0, 'number equal reversed')

        okay(comparator(1, '1'), 0, 'number reversed coalesced')

        const storted = [ 1, 2, 0 ].sort(comparator)
        okay(storted, [ 2, 1, 0 ], 'bigint sorted reversed')
    }

    // You can also create an `ascension` comparator using an existing comparator.

    {
        const existing = function (left, right) {
            return (left > right) - (left < right)
        }

        const comparator = ascension(existing)

        okay(comparator(0, 1) < 0, 'existing comparator less than')
        okay(comparator(1, 0) > 0, 'existing greater than')
        okay(comparator(0, 0), 0, 'existing equal')

        const storted = [ 1, 2, 0 ].sort(comparator)
        okay(storted, [ 0, 1, 2 ], 'bigint sorted')
    }

    // This is probably not very useful with the default ascending ordering because it
    // simply delegates to the wrapped comparator, but it may be helpful if you want to
    // reverse an existing comparator.

    {
        const existing = function (left, right) {
            return (left > right) - (left < right)
        }

        const comparator = ascension(existing, -1)

        okay(comparator(1, 0) < 0, 'existing comparator less than reversed')
        okay(comparator(0, 1) > 0, 'existing greater than reversed')
        okay(comparator(0, 0), 0, 'existing equal reversed')

        const storted = [ 1, 2, 0 ].sort(comparator)
        okay(storted, [ 2, 1, 0 ], 'bigint sorted reversed')
    }

    // Ascension also creates array comparators. We've found these especially useful in
    // the
    // [`Strata`](https://github.com/bigeasy/strata)/[`Memento`](https://github.com/bigeasy/memento)
    // b-tree implemention where they are used to order records and search for keys by
    // partial comparisons. The reversed comparions make it simple to implement
    // descending indices.
    //
    // To implemented an array comparator you specify the types in a single array
    // argument to `ascension`. If you want to sort a field descending you follow the
    // type specification with a direction of `-1`.
    //
    // Here we sort by string and then by number descending.

    {
        const comparator = ascension([ String, Number, -1 ])

        okay(comparator([ 'a', 1 ], [ 'b', 1 ]) < 0, 'composite first part less than')
        okay(comparator([ 'a', 1 ], [ 'a', 2 ]) > 0, 'composite second part less than')
        okay(comparator([ 'b', 1 ], [ 'a', 1 ]) > 0, 'composite first part greater than')
        okay(comparator([ 'a', 2 ], [ 'a', 1 ]) < 0, 'composite second greater less than')
        okay(comparator([ 'a', 1 ], [ 'a', 1 ]), 0, 'compoiste equal')

        okay(comparator([ 1, 1 ], [ '1', '1' ]), 0, 'compoite coalesced')

        const storted = [ [ 'a', 1 ], [ 'c', 2 ], [ 'b', 0 ], [ 'a', 0 ] ].sort(comparator)
        okay(storted, [ [ 'a', 1 ], [ 'a', 0 ], [ 'b', 0 ], [ 'c', 2 ] ], 'sorted ascending / descending')
    }

    // Reversible comparators for binary search.

    {
        const comparator = ascension([ String, Number ], true)

        okay(comparator([ 'a', 1 ], [ 'a', 1 ]) == 0, 'reversible equal')
        okay(comparator([ 'a', 1 ], [ 'b', 1 ]) < 0, 'reversible first part less than')
        okay(comparator([ 'b', 1 ], [ 'a', 1 ]) > 0, 'reversible first part greater than')
        okay(comparator([ 'a', 2 ], [ 'a', 1 ]) > 0, 'reversible second part less than')
        okay(comparator([ 'a', 1 ], [ 'a', 2 ]) < 0, 'reversible second part greater than')
        okay(comparator([ 'a' ], [ 'a', 1 ]) < 0, 'reversible partial equal')

        okay(comparator([ 'a', 1 ], [ 'a', 1 ], -1) > 0, 'reversible reversed equal')
        okay(comparator([ 'a', 1 ], [ 'b', 1 ], -1) < 0, 'reversible reversed first part less than')
        okay(comparator([ 'b', 1 ], [ 'a', 1 ], -1) > 0, 'reversible reversed first part greater than')
        okay(comparator([ 'a', 2 ], [ 'a', 1 ], -1) > 0, 'reversible reversed second part less than')
        okay(comparator([ 'a', 1 ], [ 'a', 2 ], -1) < 0, 'reversible reversed second part greater than')
        okay(comparator([ 'a' ], [ 'a', 1 ], -1) > 0, 'reversible reversed partial equal')
    }

    // Recursive reversible comparators for binary search.

    {
        const comparator = ascension([ [ String, Number ], Number ], true)

        okay(comparator([ [ 'a', 1 ], 1 ], [ [ 'a', 1 ], 1 ]) == 0, 'recursive reversible equal')
        okay(comparator([ [ 'a' ], 1 ], [ [ 'a', 1 ], 1 ]) < 0, 'recursive reversible nested partial equal')
        okay(comparator([ [ 'b' ], 1 ], [ [ 'a', 1 ], 1 ]) > 0, 'recursive reversible nested partial gerater than')

        okay(comparator([ [ 'a', 1 ], 1 ], [ [ 'a', 1 ], 1 ], -1) > 0, 'recursive reversible reversed equal')
        okay(comparator([ [ 'a' ], 1 ], [ [ 'a', 1 ], 1 ], -1) > 0, 'recursive reversible reversed nested partial equal')
        okay(comparator([ [ 'b' ], 1 ], [ [ 'a', 1 ], 1 ], -1) > 0, 'recursive reversible reversed nested partial gerater than')
    }
})

// You can run this unit test yourself to see the output from the various
// code sections of the readme.

// And so I save myself some coding and testing tedium.
//
// ## Usage
//
// Ascension exports a single function that you can name `ascension`. The type of
// comparator generated is dependent on the arguments passed to `ascension`.
