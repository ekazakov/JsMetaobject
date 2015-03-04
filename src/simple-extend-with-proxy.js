var _ = require('lodash');
var proxy = require('./proxy');

function extend (receiver) {
    var mixins = _.slice(arguments, 1);

    return mixins.reduce(function (acc, mixin) {
        return compose(receiver, mixin, acc);
    }, receiver);

    function compose (receiver, mixin, acc) {
        var privateContext = proxy(receiver);

        return Object.keys(mixin)
            .reduce(function (metaobject, method) {
                if (!_.isFunction(mixin[method]))
                    throw Error('Property ' + '"' + method + '" ' + 'must be a function.');

                metaobject[method] = function () {
                    var result = mixin[method].apply(privateContext, arguments);

                    return result === privateContext ? this : result;
                };

                return metaobject;
            }, acc);
    }
}

module.exports = extend;
