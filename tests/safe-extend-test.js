var _ = require('lodash');

var ModelA = {
    setMessage: function (msg) {
        this._msg = msg;
        this.methodA2();
    },

    methodA2: function () {},

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
    }
};

describe('Extedn with safekeeping context', function () {
    var extendWithProxy = require('../src/safe-extend');

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

    it('Call method from other mixin', function () {
        expect(meta).to.respondTo('setMessage');
        expect(meta).to.respondTo('methodA1');
        expect(meta).to.respondTo('methodB1');

        meta.setMessage('methodA1 called!');
        meta.methodA1();
        expect(meta.methodB1()).to.be.equal('methodB1 called and METHODA1 CALLED!');
        console.log(meta);
    });

    it('Doesn\'t expose private state', function () {
        expect(meta.methodB2()).to.be.undefined;
    });

    it('Shared prototype issue', function () {
        var meta1 = Object.create(Meta);
        var meta2 = Object.create(Meta);

        meta1.setMessage('Hello!');
        expect(meta1.methodA1()).to.be.equal('HELLO!');
        expect(meta2.methodA1).to.throw(Error);
    });
});
