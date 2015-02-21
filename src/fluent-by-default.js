var _ = require('lodash');

module.exports = function fluentByDefault (metaobject) {
    var metaproto = Object.getPrototypeOf(metaobject);
    var fluentMetaobject = Object.create(metaproto);

    _.functions(metaobject).forEach(function (methodName) {
        fluentMetaobject[methodName] = function () {
            var returnValue = metaobject[methodName].apply(this, arguments);

            return typeof returnValue === 'undefined' ? this : returnValue;
        };
    });

    return fluentMetaobject;
};
