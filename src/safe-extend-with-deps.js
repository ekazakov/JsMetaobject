var _ = require('lodash');
var proxy = require('./partial-proxy');

var privateStateId = 0;

function extend (receiver) {
    var mixins = _.slice(arguments, 1);

    return mixins.reduce(extendInternal(), receiver);
}

function extendInternal () {
    return function (acc, mixin) {
        var safekeepingName = getSafekeepingName(++privateStateId);

        return publicMethods(mixin)
            .reduce(function (metaobject, method) {
                metaobject[method] = createWrapper(mixin, method, safekeepingName);

                return metaobject;
            }, acc);
    };
}

function createWrapper (mixin, method, safekeepingName) {
    return function wrapper () {
        var privateContext = getContext(this, safekeepingName, mixin);
        var result = mixin[method].apply(privateContext, arguments);

        return result === privateContext ? this : result;
    };
}


function getContext (receiver, safekeepingName, mixin) {
    var context = receiver[safekeepingName];

    if (context == null) {
        context = createContext(receiver, mixin);

        Object.defineProperty(receiver, safekeepingName, {
            value: context,
            enumerable: false,
            writable: false
        });
    }

    return context;
}


function createContext (receiver, mixin) {
    var proto = privateMethods(mixin).reduce(function (acc, methodName) {
        acc[methodName] = mixin[methodName];
        return acc;
    }, {});

    var methods = _.compact([].concat(mixin.dependencies, publicMethods(mixin)));

    return proxy(receiver, methods, proto);
}


function getSafekeepingName (id) {
    return '__' + id + '__';
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

module.exports = extend;
