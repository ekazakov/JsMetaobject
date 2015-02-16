var extendWithProxy = require('./extend-with-proxy');

module.exports = function encapsulate (behaviour) {
    return extendWithProxy(Object.create(null), behaviour);
};
