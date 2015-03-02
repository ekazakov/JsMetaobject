module.exports = {
    Foo: {
        init: function (options) {
            this._x = options.foo;
        },

        doo: function (x) {
            this._x = this._x * x;
        },

        getX: function () { return this._x; }
    },

    Bar: {
        init: function (options) {
            this._x = options.bar;
        },

        getX: function () { return this._x; }
    }
};
