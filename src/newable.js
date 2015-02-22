var _ = require('lodash');

module.exports = function Newable (optionalName, metaobject, optionalSuper) {
    var name = _.isString(optionalName) ? optionalName : '';
    var metaobject  = _.isString(optionalName) ? metaobject : optionalName;
    var superClazz  = _.isString(optionalName) ? optionalSuper : metaobject;

    var constructor = (metaobject.constructor || function () {});
    var source = '(function ' + name + ' () { ' +
        'var r = constructor.apply(this, arguments);' +
        'return r === undefined ? this : r;' +
        '});';

    var clazz = eval(source);

    if ( _.isFunction(metaobject.constructor) && _.isFunction(optionalSuper)) {
        constructor = function () {
            optionalSuper.apply(this, arguments);
            return metaobject.constructor.apply(this, arguments);
        };
    }
    else if (typeof(metaobject.constructor) === 'function') {
        constructor = metaobject.constructor;
    }
    else if (typeof(optionalSuper) === 'function') {
        constructor = optionalSuper;
    }
    else constructor = function () {};

    if (optionalSuper != null) {
        clazz.prototype = _.assign(Object.create(optionalSuper.prototype), metaobject);
    } else {
        clazz.prototype = _.assign({}, metaobject);
    }

    delete clazz.prototype.constructor;

    return clazz;
};
