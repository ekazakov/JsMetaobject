function proxy (baseObject, methods, optionalPrototype) {
    var methodName;
    var proxyObject = Object.create(optionalPrototype || null);

    for (methodName in baseObject) {
        (function (methodName) {
            proxyObject[methodName] = function proxyWrapper () {
                var result = baseObject[methodName].apply(baseObject, arguments);
                return result === baseObject ? proxyObject : result;
            };
        }(methodName));
    }

    return proxyObject;
}

module.exports = proxy;
