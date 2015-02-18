var methodsOfType = require('./utils').methodsOfType;

module.exports = function proxy (baseObject, methods, optionalPrototype) {
    var proxyObject = Object.create(optionalPrototype || null);

    methods = methods || methodsOfType(baseObject, 'function');

    methods.forEach(function (methodName) {
        proxyObject[methodName] = function () {
            var result = baseObject[methodName].apply(baseObject, arguments);

            return result === baseObject ? proxyObject : result;
        };
    });

    return proxyObject;
};
