var _ = require('lodash');

module.exports = {
    overwrite: function overwrite (fn1, fn2) {
        return fn1;
    },

    discard: function discard (fn1, fn2) {
        return fn2;
    },

    before: function before (fn1, fn2) {
        return function () {
            var fn1Result = fn1.apply(this, arguments);
            var fn2Result = fn2.apply(this, arguments);

            return !_.isUndefined(fn2Result) ? fn2Result : fn1Result;
        };
    },

    after: function after (fn1, fn2) {
        return function () {
            var fn2Result = fn2.apply(this, arguments);
            var fn1Result = fn1.apply(this, arguments);

            return !_.isUndefined(fn2Result) ? fn2Result : fn1Result;
        };
    },

    around: function around (fn1, fn2) {
        return function () {
            var argArray = [fn2.bind(this)].concat(_.slice(arguments));
            return fn1.apply(this, argArray);
        };
    }
};
