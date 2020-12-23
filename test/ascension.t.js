require('proof')(17, okay => {
    const ascension = require('..')

    const comparator = ascension([ function (left, right) {
        return left - right
    } ])

    okay(comparator([ 1 ], [ 2 ]) < 0, 'less than')
    okay(comparator([ 2 ], [ 1 ]) > 0, 'greater than')
    okay(comparator([ 1 ], [ 1 ]) == 0, 'equal')

    const composite = ascension([ Number, String ])

    okay(composite([ 1, 'a' ], [ 1, 'b' ]) < 0, 'composite key second column less then')

    okay(composite([ 1, 'b' ], [ 1, 'a' ]) > 0, 'string greater than')

    okay(composite([ 1, 'a' ], [ 1, 'a' ]) == 0, 'composite and string equal')

    const bigints = ascension([ BigInt ])
    okay(bigints([ BigInt(Number.MAX_SAFE_INTEGER) * 2n ], [ 0n ]) > 0, 'bigint greater than')
    okay(bigints([ 0n ], [ BigInt(Number.MAX_SAFE_INTEGER) * 2n ]) < 0, 'bigint less than')
    okay(bigints([ BigInt(Number.MAX_SAFE_INTEGER) * 2n ], [ BigInt(Number.MAX_SAFE_INTEGER) * 2n ]) == 0, 'bigint equal')

    const descending = ascension([[ Number, -1 ], [ String, 1 ]])

    okay(descending([ 1, 'a' ], [ 0, 'a' ]) < 0, 'descending')

    const arrayed = ascension([ Number, Number ])

    okay(arrayed([ 1, 1 ], [ 1, 1 ]) == 0, 'arrayed equal')
    okay(arrayed([], []) == 0, 'arrayed empty equal')
    okay(arrayed([ 1, 1 ], [ 1 ]) > 0, 'arrayed greater than')
    okay(arrayed([ 1 ], [ 1, 1 ]) < 0, 'arrayed less than')

    const booleans = ascension([ Number, Number ])

    okay(booleans([ true ], [ true ]), 0, 'boolean equal')
    okay(booleans([ true ], [ false ]) > 0, 'boolean less than')
    okay(booleans([ false ], [ true ]) < 0, 'boolean greater than')
})
