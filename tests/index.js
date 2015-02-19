var _ = require('lodash');
var chai = require('chai');
var expect = chai.expect;
var encapsulate = require('../src/encapsulate');
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

        console.log('Careerist', Careerist);

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
        var Subscribable = require('../src/objects/subscribable');
        var SongwriterView = require('../src/objects/song-writer-view');
        var SubscribableSongwriter, sweetBabyJames;

        it('create meta object', function () {
            SubscribableSongwriter = composeMetaobjects(
                orderProtocol2,
                SingsSongs,
                Subscribable,
                encapsulate({
                    notify: undefined,
                    addSong: function () { this.notify(); }
                })
            );
        });

        it('create instance', function () {
            sweetBabyJames = Object.create(SubscribableSongwriter).constructor();
            expect(sweetBabyJames).ok;
        });

        it('test subscribtion', function () {
            function spy (data) {
                expect(data).equal("Taylor has written 'Fire and Rain'");
            }
            var jamesView = Object.create(SongwriterView)
                .constructor(sweetBabyJames, 'Taylor', spy);

            var obj = sweetBabyJames.addSong('Fire and Rain');
            expect(obj).to.be.equal(sweetBabyJames);

            console.log('obj', obj);
        });
    });

});
