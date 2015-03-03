var proxy = require('../src/proxy');


describe('Proxy', function () {

    it('Create proxy around object', function () {
        var target = {};
        var mixin = {foo: sinon.spy()};

        var p = proxy(mixin);
        expect(p).is.respondTo('foo');

        p.foo();
        expect(mixin.foo).have.been.calledOnce;
    });
    it('Create proxy for specified methods');
    it('Add prototype to proxy object');
});

module.exports = {};
