var proxy = require('../src/partial-proxy');

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

    it('Create proxy for specified methods', function () {
        var target = {foo: sinon.spy(), bar: sinon.spy(), baz: sinon.spy()};
        var p = proxy(target, ['bar', 'baz']);

        expect(p).is.respondTo('bar');
        expect(p).is.respondTo('baz');
        expect(p).is.not.respondTo('foo');
    });

    it('Add prototype to proxy object', function () {
        var mixin = {foo: sinon.spy()};
        var proto = {};
        var p = proxy(mixin, proto);

        expect(Object.getPrototypeOf(p)).to.equal(proto);
    });
});
