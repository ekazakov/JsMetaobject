var nameAndLength = require('./utils').nameAndLength;
var _ = require('lodash');

module.exports = function Match () {
    var isNotEmpty = _.negate(_.isEmpty);
    var functions = _.slice(arguments);
    var lengths = _.pluck(functions, 'length');
    var names = _.pluck(functions, 'name').filter(isNotEmpty);

    var name = names.length === 0 ? '' : names[0];
    var length = Math.min.apply(null, lengths);

    return nameAndLength(name, length, function () {
        var result;
        var args = arguments;

        _(functions).each(function (fn) {
            result = fn.apply(this, args);
            if (result) return false;
        }, this).value();

        return result;
    });
};
