var _ = require('lodash');
var proxy = require('./proxy');

var privateStateId = 0;

function getSafekeepingName (id) {
    return '__' + id + '__';
}

function getContext (receiver, safekeepingName, mixin) {
    var context = receiver[safekeepingName];

    if (context == null) {
        var proto = privateMethods(mixin).reduce(function (acc, methodName) {
            acc[methodName] = mixin[methodName];
            return acc;
        }, {});

        context = proxy(receiver,
                        mixin.dependencies,//_.compact([].concat(mixin.dependencies, publicMethods(mixin))),
                        proto
                       );

        Object.defineProperty(receiver, safekeepingName, {
            value: context,
            enumerable: false,
            writable: false
        });
    }

    return context;
}

function isPrivateMethod (methodName) {return methodName[0] === '_';}

function isPublicMethod (methodName) { return methodName[0] !== '_'; }

function methodFilter (predicate) {
    return function (object) {
        return _(object).
            methods().
            filter(predicate).
            value()
        ;
    };
}

var publicMethods = methodFilter(isPublicMethod);
var privateMethods = methodFilter(isPrivateMethod);

function extendInternal () {
    return function (acc, mixin) {
        privateStateId++;
        return publicMethods(mixin)
            .reduce(function (metaobject, method) {
                var safekeepingName = getSafekeepingName(privateStateId);

                metaobject[method] = function wrapper () {
                    var privateContext = getContext(this, safekeepingName, mixin);
                    var result = mixin[method].apply(privateContext, arguments);

                    return result === privateContext ? this : result;
                };

                return metaobject;
            }, acc);
    };
}

function extend (receiver) {
    var mixins = _.slice(arguments, 1);

    return mixins.reduce(extendInternal(), receiver);

}

module.exports = extend;
