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
const ascension = module.exports = function (...vargs) {
    if (Array.isArray(vargs[0])) {
        const slice = vargs.shift().slice(0)
        const reversible = !! vargs.shift()
        const comparators = []
        while (slice.length != 0) {
            if (Array.isArray(slice[0])) {
                comparators.push(ascension(slice.shift(), reversible))
            } else {
                comparators.push(ascension.apply(null, slice.splice(0, slice[1] == 1 || slice[1] == -1 ? 2 : 1)))
            }
        }
        if (reversible) {
            return function (left, right, reversal = 1) {
                assert(Array.isArray(left))
                assert(Array.isArray(right))

                for (let i = 0, I = Math.min(left.length, right.length); i < I; i++) {
                    const compare = comparators[i](left[i], right[i], reversal)
                    if (compare != 0) {
                        return compare
                    }
                }

                return left.length - right.length * reversal
            }
        }
        // Work through the array of comparators.
        return function (left, right) {
            assert(Array.isArray(left))
            assert(Array.isArray(right))

            for (let i = 0, I = Math.min(left.length, right.length); i < I; i++) {
                const compare = comparators[i](left[i], right[i])
                if (compare != 0) {
                    return compare
                }
            }

            return left.length - right.length
        }
    }
    const generated = comparator(vargs.shift())
    const direction = vargs.length == 1 ? +vargs.shift() : 1
    return function (left, right) {
        return generated(left, right) * direction
    }
}
