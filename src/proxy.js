var _ = require('lodash');

function proxy (baseObject, methods, optionalPrototype) {
    if (arguments.length === 2) {
        if (!_.isArray(methods) && _.isObject(methods)) {
            optionalPrototype = methods;
            methods = null;
        }

    }

    if (methods == null || (_.isArray(methods) && _.isEmpty(methods))) {
        var isFunction = _.compose(_.isFunction, _.propertyOf(baseObject));

        methods = _(baseObject)
            .keys()
            .filter(isFunction)
            .value()
        ;
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

function proxy2 (baseObject, methods, optionalPrototype) {
    var methodName;
    var proxyObject = Object.create(optionalPrototype || null);

    for (methodName in baseObject) {
        (function (methodName) {
            if (!_.isFunction(baseObject[methodName])) return;

            if (_.isArray(methods) && methods.length > 0) {
                if (!_.contains(methods, methodName)) return;
            }

            proxyObject[methodName] = function () {
                var result = baseObject[methodName].apply(baseObject, arguments);

                return result === baseObject ? proxyObject : result;
            };
        }(methodName));
    }

    return proxyObject;
}

module.exports = proxy2;
