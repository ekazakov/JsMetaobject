var extendPrivately = require('../src/private-extend');
var HasCareer = require('./models/has-career');

describe('Extend privatly', function () {
    var Person = extendPrivately({}, HasCareer);
    var person;

    beforeEach(function () {
        person = Object.create(Person);
    });

    it('Create mixin', function () {
        expect(Person).to.contains.all.keys('career', 'setCareer');
    });

    it('Mixin has private state', function () {
        person.setCareer('Developer');
        expect(person).to.not.have.key('chosenCareer');
    });

    it('If mixin method return this, then meta should return itself', function () {
        expect(person.setCareer('Developer')).to.equal(person);
    });

    it('Should mix only methods and throw error for other properties', function () {
        var mixin = {
            foo: function () {},
            x: 1
        };

        var test = function () {
            extendPrivately({}, mixin);
        };

        expect(test).to.throws(Error);
    });
});

module.exports = {};
