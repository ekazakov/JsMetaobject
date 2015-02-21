function methodsOfType (behaviour, type) {
    return Object.keys(behaviour).filter(function (methodName) {
        return typeof behaviour[methodName] === type;
    });
}

function isUndefined (value) {
    return typeof value === 'undefined';
}

function isntUndefined (value) {
    return typeof value !== 'undefined';
}

function isFunction (value) {
    return typeof value === 'function';
}

function after (decoration) {
    return function (methodBody) {
        return function () {
            var methodBodyResult = methodBody.apply(this, arguments);
            var decorationResult = decoration.apply(this, arguments);

            return isUndefined(methodBodyResult) ? decorationResult : methodBodyResult;
        };
    };
}

module.exports = {
    methodsOfType: methodsOfType,
    isUndefined: isUndefined,
    isntUndefined: isntUndefined,
    isFunction: isFunction,
    after: after
};
