var proxy = require('../src/proxy');

describe('Proxy', function () {

    it('Create proxy around object', function () {
        var mixin = {foo: sinon.spy()};
        var p = proxy(mixin);

        expect(p).is.respondTo('foo');
        p.foo();
        expect(mixin.foo).have.been.calledOnce;
    });

    it('Proxying methods in prototype chain', function () {
        var mixin = Object.create(Object.create({foo: sinon.spy()}));
        var p = proxy(mixin);

        expect(p).is.respondTo('foo');
        p.foo();
        expect(mixin.foo).have.been.calledOnce;
    });
});
