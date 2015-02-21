var _ = require('lodash');
var selectorize = require('./selectorize');

module.exports = function decorate (decorator, metaobject) {
    var selectors = _.slice(arguments, 2);
    var selectorFn = selectorize(selectors);

    var metaproto = Object.getPrototypeOf(metaobject);
    var decorateMetaobject = Object.create(metaproto);

    _(metaobject)
        .keys()
        .each(function (key) {
            if (_(metaobject[key]).isFunction() && selectorFn.call(metaobject, key)) {
                decorateMetaobject[key] = decorator(metaobject[key]);
            } else {
                decorateMetaobject[key] = metaobject[key];
            }
        })
        .value()
    ;

    return decorateMetaobject;
};
