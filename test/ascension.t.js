require('proof')(9, (okay) => {
    const ascension = require('..')

    const comparator = ascension([ function (left, right) {
        return left - right
    } ], function (object) { return [ object ] })

    okay(comparator(1, 2) < 0, 'less than')
    okay(comparator(2, 1) > 0, 'greater than')
    okay(comparator(1, 1) == 0, 'equal')

    const composite = ascension([ Number, String ], function (object) {
        return [ object.number, object.string ]
    })

    okay(composite({
        number: 1, string: 'a'
    }, {
        number: 1, string: 'b'
    }) < 0, 'composite key second column less then')

    okay(composite({
        number: 1, string: 'b'
    }, {
        number: 1, string: 'a'
    }) > 0, 'string greater than')

    okay(composite({
        number: 1, string: 'a'
    }, {
        number: 1, string: 'a'
    }) == 0, 'composite and string equal')

    const bigints = ascension([ BigInt ], function (object) {
        return [ object.integer ]
    })
    okay(bigints({
        integer: BigInt(Number.MAX_SAFE_INTEGER) * 2n
    }, {
        integer: 0n
    }) > 0, 'bigint greater than')
    okay(bigints({
        integer: 0n
    }, {
        integer: BigInt(Number.MAX_SAFE_INTEGER) * 2n
    }) < 0, 'bigint less than')
    okay(bigints({
        integer: BigInt(Number.MAX_SAFE_INTEGER) * 2n
    }, {
        integer: BigInt(Number.MAX_SAFE_INTEGER) * 2n
    }) == 0, 'bigint equal')
})