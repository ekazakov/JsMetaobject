var _ = require('lodash');

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


function nameAndLength (name, length, body) {
    var paramNames = [ 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p',
                       'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l',
                       'z', 'x', 'c', 'v', 'b', 'n', 'm'];

    var pars = paramNames.slice(0, length);
    var src = '(function ' + name +
        ' (' + pars.join(',') + ')' +
        '{ return body.apply(this, arguments); })';

    return eval(src);
}

function imitate (exemplar, body) {
    return nameAndLength(exemplar.name, exemplar.length, body);
}

function when (guardFn, optionalFn) {
    return optionalFn == null ? guarded : guarded(optionalFn);

    function guarded (fn) {
        return imitate(fn, function () {
            if (guardFn.apply(this, arguments))
                return fn.apply(this, arguments);
        });
    }
}

module.exports = {
    methodsOfType: methodsOfType,
    isUndefined: isUndefined,
    isntUndefined: isntUndefined,
    isFunction: isFunction,
    after: after,
    before: before,
    around: around,
    imitate: imitate,
    nameAndLength: nameAndLength,
    when: when,
};
