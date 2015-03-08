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

    around: function around () {
        var fns = _.slice(arguments);
        var fn = fns.shift();

        fns = fns.map(bindWith(this));

        return function () {
            var argArray = [fns].concat(_.slice(arguments));
            return fn.apply(this, argArray);
        };

        function bindWith(context) {
            return function (fn) {
                return fn.bind(context);
            };
        }
    }
};
