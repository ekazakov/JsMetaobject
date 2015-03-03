module.exports = {
    career: function () {
        return this.chosenCareer;
    },

    setCareer: function (career) {
        this.chosenCareer = career;
        return this;
    }
};
