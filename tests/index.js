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

    describe('get object functions', function () {
        function getObjectMethods (object) {
            return _(object)
                .keys()
                .filter(_.compose(_.isFunction, _.propertyOf(object)))
                .value()
            ;
        }

        it('Should return only objects functions', function () {
            var obj = {
                a: _.noop,
                b: _.noop,
                c: 1,
                d: 2
            };

            expect(getObjectMethods(obj)).eql(['a', 'b']);
        });
    });

    describe('Selectorize', function () {
        var selectorize, names;

        beforeEach(function () {
            selectorize = require('../src/selectorize');
            names = ['max', 'min', 'fooo', 'foo', 'abc123', '_baz', 'baz', 'bar', 'barracude'];
        });

        it('return matched names (strings)', function () {
            var select = selectorize(['foo', 'bar', 'baz']);

            expect(names.filter(select)).to.include('foo');
            expect(names.filter(select)).to.include('bar');
            expect(names.filter(select)).to.include('baz');
            expect(names.filter(select).length).to.equal(3);
        });

        it('return matched names (regexp)', function () {
            var select = selectorize([/^ba.*/]);

            expect(names.filter(select)).to.include('baz');
            expect(names.filter(select)).to.include('bar');
            expect(names.filter(select)).to.include('barracude');
            expect(names.filter(select).length).to.equal(3);
        });

        it('return matched names (function)', function () {
            var select = selectorize([function (value) {
                return value === 'min' || value === 'max';
            }]);

            expect(names.filter(select)).to.include('min');
            expect(names.filter(select)).to.include('max');
            expect(names.filter(select).length).to.equal(2);
        });
    });


    describe('Fluent by default', function () {
        var fluentByDefault = require('../src/fluent-by-default');
        var FluentSongwriter = fluentByDefault(SingsSongs);

        var hall = Object.create(SingsSongs);
        var oates = Object.create(FluentSongwriter);

        it('make object fluent', function () {
            expect(oates.constructor()).equal(oates);
            expect(oates.addSong('Aaa')).equal(oates);
        });

        it('not modify source metaobject', function () {
            hall.constructor();
            expect(hall.addSong2('Aaa')).to.be.undefined;
        });
    });

    describe('Logging Songwriter', function () {
        var decorate = require('../src/decorate');
        var after = require('../src/utils').after;

        it('decorate method', function () {
            var logAfter = after(function () { console.log('after'); return true; });
            var LoggingSongwriter = decorate(logAfter, SingsSongs, 'addSong');

            var taylor = Object.create(LoggingSongwriter);
            taylor.constructor();
            expect(taylor.addSong('foo')).to.equal(taylor);
        });

        it('return result', function () {
            var logAfter = after(function () { console.log('after'); return true; });
            var LoggingSongwriter = decorate(logAfter, SingsSongs, 'addSong2');

            var taylor = Object.create(LoggingSongwriter);
            taylor.constructor();
            expect(taylor.addSong2('foo')).to.equal(true);
        });
    });

    describe('Newable', function () {
        it('works', function () {
            var Newable = require('../src/newable');
            var Songwriter = Newable('Songwriter', SingsSongs);
            var AwardWinningSongwriter = Newable('AwardWinningSongwriter', HasAwards, Songwriter);

            var tracy = new AwardWinningSongwriter();
            tracy.addSong('Fast Car');
            tracy.addAward('Grammy');

            expect(tracy.songs()).to.include('Fast Car');
            expect(tracy.awards()).to.include('Grammy');
            // throw Error('11');
        });
    });

    describe('MetaClass', function () {
        var MetaClass = require('../src/meta-class');

        it('Create new Class object', function () {
            var Class = MetaClass.create(MetaClass);
            console.log('Class', Class);

            var BasicObjectClass = Class.create(null);

            var QuadTree = Class.create(BasicObjectClass);

            console.log('BasicObjectClass', BasicObjectClass);
            console.log('QuadTree', QuadTree);
            // QuadTree.constructor === Class

            QuadTree
                .defineMethod('initialize', function (nw, ne, se, sw) {
                    this.nw = nw;
                    this.ne = ne;
                    this.se = se;
                    this.sw = sw;
                })
                .defineMethod('population', function () {
                    return this.nw.population() + this.ne.population() +
                        this.se.population() + this.sw.population();
                })
            ;

            var tree = QuadTree.create();
            tree.initialize(1,2,3,4);
            console.dir(tree);
            // tree.population();
        });
    });
});
