require('proof')(23, okay => {
    const ascension = require('..')

    //

    // Ascension creates a comparator that compares two arrays. Ascension only
    // works with arrays.


    // You declare a comparator by declaring the type of values you want to
    // compare in an array. When you compare you must always compare arrays.

    //
    {
        const comparator = ascension([ String ])

        okay(comparator([ 'a' ], [ 'a' ]) == 0, 'string equal')
        okay(comparator([ 'a' ], [ 'z' ]) < 0, 'string less than')
        okay(comparator([ 'z' ], [ 'a' ]) > 0, 'string greater than')
    }
    //

    // Ascension only works with arrays because it is meant to simplify
    // composite comparisons. When I need a comparator that is for a scalar
    // value, I don't seem to have any problems creating a simple scalar
    // comparator. They always look like this.

    //
    {
        function comparator (left, right) {
            return (left > right) - (left < right)
        }

        okay(comparator('a', 'a') == 0, 'string equal')
        okay(comparator('a', 'z') < 0, 'string less than')
        okay(comparator('z', 'a') > 0, 'string greater than')
    }
    //

    // Composite comparators are a little more tedious, though, and Ascension
    // makes them a little less tedious.

    // To create a composite comparator you provide an array of the types of the
    // composite key.

    //
    {
        const comparator = ascension([ Number, String ])

        okay(comparator([ 1, 'a' ], [ 1, 'a' ]) == 0, 'composite equal')
        okay(comparator([ 1, 'a' ], [ 1, 'b' ]) < 0, 'composite second column less then')
        okay(comparator([ 1, 'b' ], [ 1, 'a' ]) > 0, 'composite second column greater than')
    }
    //

    // In addition to `String` and `Number` you can compare `BigInt`s ...

    //
    {
        const comparator = ascension([ BigInt ])

        okay(comparator([ BigInt(Number.MAX_SAFE_INTEGER) * 2n ], [ 0n ]) > 0, 'bigint greater than')
        okay(comparator([ 0n ], [ BigInt(Number.MAX_SAFE_INTEGER) * 2n ]) < 0, 'bigint less than')
        okay(comparator([ BigInt(Number.MAX_SAFE_INTEGER) * 2n ], [ BigInt(Number.MAX_SAFE_INTEGER) * 2n ]) == 0, 'bigint equal')
    }
    //

    // ... and `Boolean`s.

    //
    {
        const booleans = ascension([ Number, Number ])

        okay(booleans([ true ], [ true ]), 0, 'boolean equal')
        okay(booleans([ true ], [ false ]) > 0, 'boolean less than')
        okay(booleans([ false ], [ true ]) < 0, 'boolean greater than')
    }


    const comparator = ascension([ function (left, right) {
        return left - right
    } ])

    okay(comparator([ 1 ], [ 2 ]) < 0, 'less than')
    okay(comparator([ 2 ], [ 1 ]) > 0, 'greater than')
    okay(comparator([ 1 ], [ 1 ]) == 0, 'equal')



    const descending = ascension([[ Number, -1 ], [ String, 1 ]])

    okay(descending([ 1, 'a' ], [ 0, 'a' ]) < 0, 'descending')

    const arrayed = ascension([ Number, Number ])

    okay(arrayed([ 1, 1 ], [ 1, 1 ]) == 0, 'arrayed equal')
    okay(arrayed([], []) == 0, 'arrayed empty equal')
    okay(arrayed([ 1, 1 ], [ 1 ]) > 0, 'arrayed greater than')
    okay(arrayed([ 1 ], [ 1, 1 ]) < 0, 'arrayed less than')

})
