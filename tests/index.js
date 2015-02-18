var _ = require('lodash');
var chai = require('chai');
var expect = chai.expect;
// var encapsulate = require('../src/encapsulate');
var orderProtocol = require('../src/order-protocol');
var orderProtocol2 = require('../src/order-protocol2');
var composeMetaobjects = require('../src/compose-meta-objects');

var HasAwards = require('../src/objects/has-awards');
var SingsSongs = require('../src/objects/sings-songs');

describe('Tests', function () {

    describe('AwardWinningSongwriter', function() {
        var AwardWinningSongwriter;
        var tracy;

        it('create new metaobject', function() {
            AwardWinningSongwriter = composeMetaobjects(orderProtocol, SingsSongs, HasAwards);
            expect(AwardWinningSongwriter).ok;
        });

        it('create instance', function () {
            tracy = Object.create(AwardWinningSongwriter);

            expect(tracy).ok;
            tracy = tracy.constructor();

            expect(tracy).ok;
        });

        it('add songs', function () {
            tracy.addSong('Fast Car');
            expect(tracy.songs()).eql(['Fast Car']);
        });
    });

    describe('Metaobjects dependencies/coupling', function () {
        var HasName = require('../src/objects/has-name');
        var HasCareer = require('../src/objects/has-career');
        var IsSelfDescribing = require('../src/objects/is-self-describing');

        var Careerist = _.assign({}, HasName, HasCareer, IsSelfDescribing);
        var michael, bewitched;

        beforeEach(function() {
            michael = Object.create(Careerist);
            bewitched = Object.create(Careerist);
        });


        it('create meta', function () {
            michael.setName('Michael Sam');
            bewitched.setName('Samantha Stephens');

            michael.setCareer('Athlete');
            bewitched.setCareer('Thaumaturge');

            expect(michael.description()).eql('Michael Sam is a Athlete');
            expect(bewitched.description()).eql('Samantha Stephens is a Thaumaturge');
        });
    });


    describe('Subscribe to Songwriter', function () {
        var Subscribable = {};
    });
});
