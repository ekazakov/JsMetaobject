var encapsulate = require('../encapsulate');

module.exports = encapsulate({
    career: function () {
        return this.chosenCareer;
    },

    setCareer: function (career) {
        this.chosenCareer = career;
        return this;
    }
});
