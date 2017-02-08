// Declarative comparator logic. Saves me the trouble of unit testing the
// ternary potpourri of a string comparator time and again. Saves me the bother
// of unit testing a composite comparator with it's handful of different
// branches.

//
module.exports = function (comparators, extractor) {
    // Convert `Number` to a numeric comparator and `String` to a comparator
    // that casts to string and uses operators.
    comparators = comparators.map(function (comparator) {
        if (comparator === Number) {
            return function (left, right) { return +left - +right }
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
        var compare = 0

        left = extractor(left)
        right = extractor(right)

        for (var i = 0, I = comparators.length; compare == 0 && i < I; i++) {
            compare = comparators[i](left[i], right[i])
        }

        return compare
    }
}
