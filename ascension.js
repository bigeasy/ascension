const assert = require('assert')

// Declarative comparator logic. Saves me the trouble of unit testing the
// ternary potpourri of a string comparator time and again. Saves me the bother
// of unit testing a composite comparator with it's handful of different
// branches.
function comparator (comparator) {
    if (comparator === Number) {
        return function (left, right) {
            return (+left > +right) - (+left < +right)
        }
    }
    if (comparator == BigInt) {
        return function (left, right) {
            left = BigInt(left)
            right = BigInt(right)
            return (left > right) - (left < right)
        }
    }
    if (comparator === String) {
        return function (left, right) {
            left = String(left)
            right = String(right)
            return (left > right) - (left < right)
        }
    }
    if (comparator === Boolean) {
        return function (left, right) {
            return (!!left > !!right) - (!!left < !!right)
        }
    }
    return comparator
}

//
module.exports = function (...vargs) {
    if (Array.isArray(vargs[0])) {
        const slice = vargs[0].slice(0)
        const comparators = []
        while (slice.length != 0) {
            comparators.push(module.exports.apply(null, slice.splice(0, slice[1] == 1 || slice[1] == -1 ? 2 : 1)))
        }
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
                compare = comparators[i](left[i], right[i])
            }

            if (compare != 0) {
                return compare
            }

            compare = left.length - right.length
            assert(!isNaN(compare))
            return compare
        }
    }
    const generated = comparator(vargs.shift())
    const direction = vargs.length == 1 ? +vargs.shift() : 1
    return function (left, right) {
        return generated(left, right) * direction
    }
}
