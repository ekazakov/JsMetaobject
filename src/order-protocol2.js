var isntUndefined = require('./utils').isntUndefined;
var _ = require('lodash');

module.exports = function orderProtocol2 () {
    if (arguments.length === 1) {
        return arguments[0];
    } else {
        var fns = _.slice(arguments);

        return function composed () {
            var args    = arguments,
                context = this,
                values  = fns.map(function (fn) {
                    return fn.apply(context, args);
                }).filter(isntUndefined);

            if (values.length > 0) {
                return values[values.length - 1];
            }
        };
    }
};
