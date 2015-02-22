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

function before (decoration) {
    return function (methodBody) {
        return function () {
            var decorationResult = decoration.apply(this, arguments);
            var methodBodyResult = methodBody.apply(this, arguments);

            return typeof methodBodyResult === 'undefined' ? decorationResult : methodBodyResult;
        };
    };
}

function around (decoration) {
    return function (methodBody) {
        return function () {
            return decoration.apply(this, [methodBody].concat([].slice.call(arguments, 0)));
        };
    };
}

module.exports = {
    methodsOfType: methodsOfType,
    isUndefined: isUndefined,
    isntUndefined: isntUndefined,
    isFunction: isFunction,
    after: after,
    before: before,
    around: around,
};
