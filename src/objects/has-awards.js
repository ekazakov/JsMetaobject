var encapsulate = require('../encapsulate');

module.exports = encapsulate({
    _awards: null,

    constructor: function () {
        this._awards = [];
        return this;
    },

    addAward: function (name) {
        this._awards.push(name);
        return this;
    },

    awards: function () {
        return this._awards;
    }
});
