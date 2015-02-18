module.exports = function orderProtocol () {
    if (arguments.length === 1){
        return arguments[0];
    } else {
        var fns = arguments;
        return function composed () {
            for (var i = 0; i < (fns.length - 1); ++i) {
                fns[i].apply(this, arguments);
            }
            return fns[fns.length - 1].apply(this, arguments);
        };
    }
};
