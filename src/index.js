var encapsulate = require('./encapsulate');
var composeMetaobjects = require('./compose-meta-objects');

var HasCareer = encapsulate({
    career: function () {
        return this.chosenCareer;
    },
    setCareer: function (career) {
        this.chosenCareer = career;
        return this;
    },
});

var HasName = encapsulate({
    setName: function (name) {
        this._name = name;
    },

    name: function () {
        return this._name;
    }
});

var IsSelfDescribing = encapsulate({
    name: undefined,
    career: undefined,

    description: function () {
        return this.name() + ' is a ' + this.career();
    }
});

console.log('Hello!');
