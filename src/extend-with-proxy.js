var proxy = require('./proxy');
var utils = require('./utils');

var methodsOfType = utils.methodsOfType;

var privateStateId = 0;

function createContext (methodReceiver) {
    var proto = privateMethods.reduce(function (acc, methodName) {
        acc[methodName] = behaviour[methodName];

        return acc;
    }, {});

    var innerProxy = proxy(methodReceiver, dependencies, proto);

    return Object.defineProperty(innerProxy, 'self', {
        writable: false,
        enumerable: false,
        value: methodReceiver
    });
}

function getContext (methodReceiver) {
    var context = methodReceiver[safekeepingName];

    if (context == null) {
        context = createContext(methodReceiver);
        Object.defineProperty(methodReceiver, safekeepingName, {
            enumerable: false, writable: false, value: context
        });
    }

    return context;
}

module.exports = function extendWithProxy (baseObject, behaviour) {
    var safekeepingName = '__' + (++privateStateId) + '__';

    var methods = methodsOfType(behaviour, 'function');
    var dependencies = methodsOfType(behaviour, 'undefined');

    var privateMethods = methods.filter(function (methodName) {
        return methodName[0] === '_';
    });

    var publicMethods = methods.filter(function (methodName) {
        return methodName[0] !== '_';
    });

    return publicMethods.reduce(function (acc, methodName) {
        var methodBody = behaviour[methodName];

        acc[methodName] = function () {
            var context = getContext(this);
            var result = methodBody.apply(context, arguments);

            return (result === context) ? this : result;
        };

        return acc;
    }, {});
};
