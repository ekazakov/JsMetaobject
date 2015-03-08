var _ = require('lodash');
var policies = require('./policies');
var proxy = require('./partial-proxy');

var privateStateId = 0;

function compose () {
    var mixins = _.slice(arguments, 0, -1);
    var policiesSchema = _.slice(arguments, -1)[0];

    var metaobjects = _.map(mixins, function (mixin) {
        return extendInternal({}, mixin);
    });

    var conflictsShema = propertiesToArrays(metaobjects);
    policiesSchema = inversePoliciesSchema(policiesSchema);

    return resolve(conflictsShema, policiesSchema);
}

function extendInternal (acc, mixin) {
    var safekeepingName = getSafekeepingName(++privateStateId);

    return publicMethods(mixin)
        .reduce(function (metaobject, method) {
            metaobject[method] = createWrapper(mixin, method, safekeepingName);

            return metaobject;
        }, acc);
}

function resolve (conflictsShema, policiesSchema) {
    var defaultPolicyName = policiesSchema['*'] || 'before';

    return Object.keys(conflictsShema).reduce(function (meta, fnName) {
        var policy = policiesSchema[fnName] || defaultPolicyName;
        var policyFn = policies[policy];

        if (conflictsShema[fnName].length === 1) {
            meta[fnName] = conflictsShema[fnName][0];
        } else {
            meta[fnName] = policyFn.apply(this, conflictsShema[fnName]);
        }
        return meta;
    }, Object.create(null));
}

function inversePoliciesSchema (hash) {
    return Object.keys(hash).reduce(function (inversion, policyName) {
        var methodNameOrNames = hash[policyName];
        var methodName;

        if (_.isString(methodNameOrNames)) {
            methodName = methodNameOrNames;
            inversion[methodName] = policyName;
        } else if (_.isArray(methodNameOrNames)) {
            _.each(methodNameOrNames, function (methodName) {
                inversion[methodName] = policyName;
            });
        }

        return inversion;
    }, {});
}

function propertiesToArrays (metaobjects) {
    return metaobjects.reduce(function (collected, metaobject) {
        Object.keys(metaobject).forEach(function (key) {
            if (Object.prototype.hasOwnProperty.call(collected, key)) {
                collected[key].push(metaobject[key]);
            } else {
                collected[key] = [metaobject[key]];
            }
        });

        return collected;
    }, Object.create(null));
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

module.exports = compose;
