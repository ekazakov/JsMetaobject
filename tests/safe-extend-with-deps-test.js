var _ = require('lodash');

var Person = {
    setName: function (name) {
        this._name = name;
    },

    name: function () {
        return this._name;
    },

    description: function () {
        return this.name() + ' the ' + this.profession();
    }
};

var Profession = {
    setProfession: function (profession) {
        this._profession = profession;
    },

    profession: function () {
        return this._profession;
    }
};

describe('Profession sample', function () {
    var extendWithProxy = require('../src/safe-extend');
    var Professional = extendWithProxy({}, Person, Profession);

    it('works', function () {
        var bilbo = Object.create(Professional);
        bilbo.setName('Bilbo Baggins');
        bilbo.setProfession('Burglar');
        expect(bilbo.description()).to.be.equal('Bilbo Baggins the Burglar');

        var frodo = Object.create(Professional);
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
    dependencies: ['methodA1'],

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

describe('Extend with dependencies and safekeeping context', function () {
    var extendWithProxy = require('../src/safe-extend-with-deps');

    var Meta = extendWithProxy({}, ModelA, ModelB);
    var meta;

    beforeEach(function () {
        meta = Object.create(Meta);
    });

    // var extend = require('../src/extend-with-proxy');
    // it('ll', function () {
    //     var A = extend({}, ModelA);
    //     var B = extend({}, _.assign({}, ModelB, {methodA1: undefined}));

    //     var Meta = _.assign({}, A, B);
    //     var meta = Object.create(Meta);
    //     meta.setMessage('Hello');
    //     meta.methodA1();
    //     meta.methodB1();
    //     console.log('meta:', meta);
    // });

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
        expect(meta.methodB3.bind(meta)).to.throw(Error);
    });

    it('Doesn\'t expose private state', function () {
        expect(meta.methodB2()).to.be.undefined;
    });

    it('Doesn\'t share private state with other instances', function () {
        var meta1 = Object.create(Meta);
        var meta2 = Object.create(Meta);

        meta1.setMessage('Hello!');
        expect(meta1.methodA1()).to.be.equal('HELLO!');
        expect(meta2.methodA1.bind(meta)).to.throw(Error);
    });
});
