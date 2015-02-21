var _ = require('lodash');

module.exports = function selectorize (selectors) {
    var fns = selectors.map(selectorFactory);

    return function select (name) {
        return fns.some(_.curry(invoke)(_, name), this);
    };
};

function selectorFactory (selector) {
    var index = _.findIndex(predicates, function (p) {
        return p.typeTest(selector);
    });

    return index !== -1 ? predicates[index].test(selector) : null;
}

function invoke (fn, value) {
    return fn.call(this, value);
}

var predicates = [
    {
        typeTest: _.isString,
        test: _.curry(_.isEqual, 2)
    },
    {
        typeTest: _.isFunction,
        test: _.identity
    },
    {
        typeTest: _.isRegExp,
        test: _.curry(function (regex, value) {
            return Boolean(value.match(regex));
        })
    }
];
