var encapsulate = require('../encapsulate');

module.exports  = encapsulate({
    setName: function (name) {
        this._name = name;
    },

    name: function () {
        return this._name;
    }
});
