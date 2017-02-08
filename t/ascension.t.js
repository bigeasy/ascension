require('proof/redux')(1, prove)

function prove (assert) {
    var ascension = require('..')
    assert(ascension, 'require')
}
