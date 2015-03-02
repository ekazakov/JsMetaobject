var _ = require('lodash');
var exec = _.curry(function exec (context, args, fn) {
    return fn.apply(context, args);
});

module.exports = {
    overwrite: function overwrite () {
        return arguments[0];
    },

    discard: function discard () {
        return _(arguments).slice(-1).first();
    },

    before: function before () {
        var fns = _.slice(arguments);

        return function () {
            return _(fns)
                .map(exec(this, arguments))
                .filter(_.negate(_.isUndefined))
                .first()
            ;
        };
    },

    after: function after () {
        var fns = _.slice(arguments);

        return function () {
            return _(fns.reverse())
                .map(exec(this, arguments))
                .filter(_.negate(_.isUndefined))
                .first()
            ;
        };
    },

    around: function around (fn1, fn2) {
        return function () {
            var argArray = [fn2.bind(this)].concat(_.slice(arguments));
            return fn1.apply(this, argArray);
        };
    }
};
