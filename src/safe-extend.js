var _ = require('lodash');
var proxy = require('./proxy');

var privateStateId = 0;

function getSafekeepingName (id) {
    return '__' + id + '__';
}

function getContext (receiver, safekeepingName) {
    var context = receiver[safekeepingName];

    if (context == null) {
        context = proxy(receiver);

        Object.defineProperty(receiver, safekeepingName, {
            value: context,
            enumerable: false,
            writable: false
        });
    }

    return context;
}

function createWrapper (mixin, method, safekeepingName) {
    return function wrapper () {
        var privateContext = getContext(this, safekeepingName);
        var result = mixin[method].apply(privateContext, arguments);

        return result === privateContext ? this : result;
    };
}

function extendInternal () {
    return function (acc, mixin) {
        var safekeepingName = getSafekeepingName(++privateStateId);

        return _.methods(mixin).
            reduce(function (metaobject, method) {
                metaobject[method] = createWrapper(mixin, method, safekeepingName);

                return metaobject;
            }, acc);
    };
}

function extend (receiver) {
    return _.slice(arguments, 1).
        reduce(extendInternal(), receiver)
    ;
}

module.exports = extend;
