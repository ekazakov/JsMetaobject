var _ = require('lodash');

function extend (receiver, mixin) {
    var privateContext = Object.create(null);

    return Object.keys(mixin)
        .reduce(function (metaobject, method) {
            if (!_.isFunction(mixin[method]))
                throw Error('Property ' + '"' + method + '" ' + 'must be a function.');

            metaobject[method] = function () {
                var result = mixin[method].apply(privateContext, arguments);

                return result === privateContext ? this : result;
            };

            return metaobject;
        }, receiver);
}

module.exports = extend;
