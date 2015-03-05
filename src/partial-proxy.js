var _ = require('lodash');

function deepMethods (target) {
    var methods = [];

    for (var method in target) {
        if (_.isFunction(target[method])) {
            methods.push(method);
        }
    }

    return methods;
}

function notArrayButObject (target) {
    return !_.isArray(target) && _.isObject(target);
}

function isEmptyArray (obj) {
    return _.isArray(obj) && _.isEmpty(obj);
}

module.exports = function proxy (baseObject, methods, optionalPrototype) {
    if (arguments.length === 2 && notArrayButObject(methods)) {
        optionalPrototype = methods;
        methods = null;
    }

    if (methods == null || isEmptyArray(methods)) {
        methods = deepMethods(baseObject);
    }

    var proxyObject = Object.create(optionalPrototype || null);

    return methods.reduce(function (metaobject, methodName) {
        metaobject[methodName] = function () {
            var result = baseObject[methodName].apply(baseObject, arguments);
            return result === baseObject ? proxyObject : result;
        };

        return metaobject;
    }, proxyObject);
}
