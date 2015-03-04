var _ = require('lodash');
var proxy = require('./proxy');

var __safekeeping__ = 0;

function getContext (receiver, safekeeping, mixin) {
    if (receiver['__' + safekeeping + '__'] == null) {

        var proxyObject = proxy(receiver, ['methodA1']);

        Object.defineProperty(receiver, '__' + safekeeping + '__', {
            value: proxyObject,
            enumerable: false,
            writable: true
        });

        return proxyObject;
    }

    return receiver['__' + safekeeping + '__'];
}

function extend (receiver) {
    var mixins = _.slice(arguments, 1);

    return mixins.reduce(function (acc, mixin) {
        return compose(receiver, mixin, acc);
    }, receiver);

    function compose (receiver, mixin, acc) {
        __safekeeping__++;

        var methods = Object.keys(mixin);
        return methods
            .reduce(function (metaobject, method) {
                (function (safekeeping) {
                    metaobject[method] = function () {
                        var privateContext = getContext(this, safekeeping, mixin);
                        var result = mixin[method].apply(privateContext, arguments);

                        return result === privateContext ? this : result;
                    };
                })(__safekeeping__);

                return metaobject;
            }, acc);
    }
}

module.exports = extend;
