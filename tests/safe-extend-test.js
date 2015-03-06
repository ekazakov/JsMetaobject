var _ = require('lodash');


describe('Bad Hobbit sample', function () {
    var extendWithProxy = require('../src/safe-extend');
    var M = require('./models/hobbits');

    var Hobbit = extendWithProxy({}, M.Person, M.Profession, M.RingKeeper);

    it('works', function () {
        var bilbo = Object.create(Hobbit);
        bilbo.setName('Bilbo Baggins');
        bilbo.setProfession('Burglar');
        expect(bilbo.description()).to.be.equal('Bilbo Baggins the Burglar');
        expect(bilbo.disappear.bind(bilbo)).to.not.throw(Error);

        var frodo = Object.create(Hobbit);
        console.log('bilbo', bilbo);
        console.log('frodo', frodo);
        expect(frodo.name()).to.be.undefined;
        expect(frodo.profession()).to.be.undefined;
    });
});

var ModelA = {
    setMessage: function (msg) {
        this._msg = msg;
    },

    methodA2: function () {
        return 'A2';
    },

    methodA3: function () {
        return this.methodA2();
    },

    methodA1: function () {
        return this._capitalize();
    },

    _capitalize: function () {
        return this._msg.toUpperCase();
    }
};

var ModelB = {
    methodB1: function () {
        return 'methodB1 called and ' + this.methodA1();
    },

    methodB2: function () {
        return this._msg;
    },

    methodB3: function () {
        this.methodA3();
    }
};

describe('Extend with safekeeping context', function () {
    var extendWithProxy = require('../src/safe-extend');

    var Meta = extendWithProxy({}, ModelA, ModelB);
    var meta;

    beforeEach(function () {
        meta = Object.create(Meta);
    });

    it('Mix objects together', function () {
        expect(meta).to.respondTo('setMessage');
        expect(meta).to.respondTo('methodA1');
        expect(meta).to.respondTo('methodA2');
        expect(meta).to.respondTo('methodA3');
        // expect(meta).to.respondTo('_capitalize');
        expect(meta).to.respondTo('methodB1');
        expect(meta).to.respondTo('methodB2');
    });

    it('Mixin methods could call self public methods', function () {
        expect(meta.methodA3()).to.be.equal('A2');
    });

    it('Have access to declared dependencies from other mixin', function () {
        meta.setMessage('methodA1 called!');
        meta.methodA1();
        expect(meta.methodB1()).to.be.equal('methodB1 called and METHODA1 CALLED!');
        console.log('meta', meta);
    });

    it('Hasn\'t access to other mixins methods', function () {
        expect(meta.methodB3.bind(meta)).to.not.throw(Error);
    });

    it('Doesn\'t expose private state', function () {
        expect(meta.methodB2()).to.be.undefined;
    });

    it('Doesn\'t share private state with other instances', function () {
        var meta1 = Object.create(Meta);
        var meta2 = Object.create(Meta);

        meta1.setMessage('Hello!');
        expect(meta1.methodA1()).to.be.equal('HELLO!');
        expect(meta2.methodA1.bind(meta2)).to.throw(Error);
    });
});
