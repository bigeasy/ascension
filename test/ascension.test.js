describe('ascension', () => {
    const ascension = require('..')
    const assert = require('assert')
    it('can create a comparator from a function', () => {
        const comparator = ascension([ function (left, right) {
            return left - right
        } ], function (object) { return [ object ] })

        assert(comparator(1, 2) < 0, 'less than')
        assert(comparator(2, 1) > 0, 'greater than')
        assert(comparator(1, 1) == 0, 'equal')
    })

    it('can create a comparator from a type', () => {
        const comparator = ascension([ Number, String ], function (object) {
            return [ object.number, object.string ]
        })

        assert(comparator({
            number: 1, string: 'a'
        }, {
            number: 1, string: 'b'
        }) < 0, 'composite key second column less then')

        assert(comparator({
            number: 1, string: 'b'
        }, {
            number: 1, string: 'a'
        }) > 0, 'string greater than')

        assert(comparator({
            number: 1, string: 'a'
        }, {
            number: 1, string: 'a'
        }) == 0, 'composite and string equal')
    })
})
