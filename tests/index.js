var _ = require('lodash');
var chai = require('chai');

var expect = chai.expect;
var encapsulate = require('../src/encapsulate');
var orderProtocol = require('../src/order-protocol');
var orderProtocol2 = require('../src/order-protocol2');
var composeMetaobjects = require('../src/compose-meta-objects').composeMetaobjects;
var propertiesToArrays = require('../src/compose-meta-objects').propertiesToArrays;
var inverse = require('../src/compose-meta-objects').inverse;
var composeWithResolution = require('../src/compose-meta-objects').composeWithResolution;
var dumbs = require('./conflict-dumbs');

var HasAwards = require('../src/objects/has-awards');
var SingsSongs = require('../src/objects/sings-songs');
var policies = require('../src/policies');

describe('Tests', function () {

    describe('Conflict detection', function () {
        var objects = [
            {foo: sinon.spy(), bar: sinon.spy(), baz: sinon.spy()},
            {foo: sinon.spy(), baz: sinon.spy()},
            {foo: sinon.spy(), qux: sinon.spy()},
            {qoo: sinon.spy()},
        ];

        it('detect conflicts and create conflict scheme', function () {
            var conflictsShema = propertiesToArrays(objects);

            console.log('conflictsShema', conflictsShema);
            expect(conflictsShema).to.have.all.keys(['foo', 'bar', 'baz', 'qux', 'qoo']);

            expect(conflictsShema.foo).to.be.instanceof(Array);
            expect(conflictsShema.baz).to.be.instanceof(Array);
            expect(conflictsShema.bar).to.be.instanceof(Array);
            expect(conflictsShema.qux).to.be.instanceof(Array);
            expect(conflictsShema.qoo).to.be.instanceof(Array);

            expect(conflictsShema.foo.length).to.be.equal(3);
            expect(conflictsShema.baz.length).to.be.equal(2);
            expect(conflictsShema.bar.length).to.be.equal(1);
            expect(conflictsShema.qoo.length).to.be.equal(1);
            expect(conflictsShema.qux.length).to.be.equal(1);
        });
    });

    describe('composeWithResolution', function () {
        var Foo = dumbs.Foo;
        var Bar = dumbs.Bar;
        sinon.spy(Foo, 'init');
        sinon.spy(Bar, 'init');


        var Foo1 = encapsulate(Foo);
        var Bar1 = encapsulate(Bar);

        it('after', function () {
            var Meta = composeWithResolution([Foo1, Bar1], {after: 'init'});
            var meta = Object.create(Meta);

            meta.init({});
            expect(Foo.init.calledOnce).to.be.true;
            expect(Bar.init.calledOnce).to.be.true;
            expect(Foo.init.calledAfter(Bar.init)).to.be.true;
        });
    });

    describe('Conflict resoulution policies', function () {
        var f1 = function () { return 'f1'; };
        var f2 = function () { return 'f2'; };
        var f3 = function () { return 'f3'; };

        it('overwrite', function () {
            var f = policies.overwrite(f1, f2);
            expect(f).to.equal(f1);
        });

        it('discard', function () {

        });
    });

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

    describe('Predicate dispatch', function () {
        var equal = _.curry(_.isEqual, 2);
        var Match = require('../src/match');
        var when = require('../src/utils').when;

        it('works', function () {
            var test = Match(
                when(equal(1), function one () { return 'One'; }),
                when(equal(2), function two () { return 'Two'; }),
                function other () { return 'Other'; }
            );

            expect(test(1)).to.equal("One");
            expect(test(2)).to.equal("Two");
            expect(test(3)).to.equal("Other");
        });
    });

    describe('Multiple dispatch', function () {
        var utils = require('../src/utils');
        var whenArgsAre = utils.whenArgsAre;
        var Match = require('../src/match');

        it('test it', function () {
            var equal = _.curry(_.isEqual, 2);

            var test = Match(
                whenArgsAre(equal('A'), equal('B'), function (a, b) { return a + b; }),
                whenArgsAre(equal('C'), equal('D'), equal('G'), function (a, b, g) { return a + b + g; }),
                whenArgsAre(equal('E'), equal('F'), function (a, b) { return a + b; })
            );

            expect(test('A', 'B')).to.equal('AB');
            expect(test('C', 'D', 'G')).to.equal('CDG');
            expect(test('E', 'F')).to.equal('EF');
        });
    });
});
