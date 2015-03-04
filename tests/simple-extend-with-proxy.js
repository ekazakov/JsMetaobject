var _ = require('lodash');

var ModelA = {
    setMessage: function (msg) {
        this._msg = msg;
    },
    methodA1: function () {
        return this._msg;
    }
};

var ModelB = {
    methodB1: function () {
        return 'methodB1 called and ' + this.methodA1();
    },

    methodB2: function () {
        return this._msg;
    }
};

describe('Extedn with proxy', function () {
    var extendWithProxy = require('../src/simple-extend-with-proxy');

    var Meta = extendWithProxy({}, ModelA, ModelB);
    var meta;

    beforeEach(function () {
        meta = Object.create(Meta);
    });

    it('Call method from other mixin', function () {
        expect(meta).to.respondTo('setMessage');
        expect(meta).to.respondTo('methodA1');
        expect(meta).to.respondTo('methodB1');

        meta.setMessage('methodA1 called!');
        expect(meta.methodB1()).to.be.equal('methodB1 called and methodA1 called!');
    });

    it('Doesn\'t expose private state', function () {
        expect(meta.methodB2()).to.be.undefined;
    });

    it('Shared prototype issue', function () {
        var meta1 = Object.create(Meta);
        var meta2 = Object.create(Meta);

        meta1.setMessage('Hello!');
        expect(meta1.methodA1()).to.be.equal('Hello!');
        expect(meta2.methodA1()).to.be.equal('Hello!');
    });
});
