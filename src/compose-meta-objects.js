var utils = require('./utils');
var _ = require('lodash');

var isFunction = utils.isFunction;
var isUndefined = utils.isUndefined;
var isntUndefined = utils.isntUndefined;

function inverse (hash, policies) {
    return Object.keys(hash).reduce(function (inversion, policyName) {
        var methodNameOrNames = hash[policyName];
        var methodName;

        if (_.isString(methodNameOrNames)) {
            methodName = methodNameOrNames;
            inversion[methodName] = policies[policyName];
        } else if (_.isArray(methodNameOrNames)) {
            _.each(methodNameOrNames, function (methodName) {
                inversion[methodName] = policies[policyName];
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

function resolveUndefineds (collected) {
    return Object.keys(collected).reduce(function (resolved, key) {
        var values = collected[key];

        if (values.every(isUndefined)) {
            resolved[key] = undefined;
        } else {
            resolved[key] = values.filter(isntUndefined);
        }

        return resolved;
    }, {});
}

function applyProtocol (resolveds, protocol) {
    return Object.keys(resolveds).reduce(function (applied, key) {
        var value = resolveds[key];

        if (isUndefined(value)) {
            applied[key] = value;
        } else if (value.every(isFunction)) {
            applied[key] = protocol.apply(null, value);
        } else {
            throw "Don't know what to do with";
        }

        return applied;
    }, {});
}

function composeMetaobjects (protocol) {
    var metaobjects = _.slice(arguments, 1);
    var arrays = propertiesToArrays(metaobjects);
    var resolved = resolveUndefineds(arrays);

    return applyProtocol(resolved, protocol);
}


module.exports = {
    inverse: inverse,
    propertiesToArrays: propertiesToArrays,
    resolveUndefineds: resolveUndefineds,
    applyProtocol: applyProtocol,
    composeMetaobjects: composeMetaobjects,
};
