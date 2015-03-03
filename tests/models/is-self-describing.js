var encapsulate = require('../encapsulate');

module.exports = encapsulate({
    name: undefined,
    career: undefined,

    description: function () {
        return this.name() + ' is a ' + this.career();
    }
});
