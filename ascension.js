const assert = require('assert')

// Declarative comparator logic. Saves me the trouble of unit testing the
// ternary potpourri of a string comparator time and again. Saves me the bother
// of unit testing a composite comparator with it's handful of different
// branches.

//
module.exports = function (comparators) {
    const directions = comparators.map(function (comparator) {
        return Array.isArray(comparator) ? comparator[1] : 1
    })
    // Convert `Number` to a numeric comparator and `String` to a comparator
    // that casts to string and uses operators.
    comparators = comparators.map(function (comparator) {
        if (Array.isArray(comparator)) {
            comparator = comparator[0]
        }
        if (comparator === Number) {
            return function (left, right) { return +left - +right }
        }
        if (comparator == BigInt) {
            return function (left, right) {
                return BigInt(left) < BigInt(right) ? -1 : BigInt(left) > BigInt(right) ? 1 : 0
            }
        }
        if (comparator === String) {
            return function (left, right) {
                left = String(left)
                right = String(right)
                return left < right ? -1 : left > right ? 2 : 0
            }
        }
        return comparator
    })
    // Work through the array of comparators.
    return function (left, right) {
        assert(Array.isArray(left))
        assert(Array.isArray(right))
        var compare = 0

        for (
            let i = 0, I = Math.min(left.length, right.length);
            compare == 0 && i < I;
            i++
        ) {
            compare = comparators[i](left[i], right[i]) * directions[i]
        }

        if (compare != 0) {
            return compare
        }

        compare = left.length - right.length
        assert(!isNaN(compare))
        return compare
    }
}
