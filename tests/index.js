var chai = require('chai');
var expect = chai.expect;

var encapsulate = require('../src/encapsulate');
var composeMetaobjects = require('../src/compose-meta-objects');


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

describe('first test', function() {
    it('test', function() {
        expect(true).equal(true);
        expect(2).equal(3);
    });
});
