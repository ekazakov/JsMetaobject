var _ = require('lodash');

var A = {
    foo: function () {
        return 'A#foo';
    },

    foo1: function () {
        return 'A#foo1';
    },

    foo2: function () {

    },

    foo3: function (fns) {
        var results = fns.map(function (fn) { return fn.apply(null); });
        return 'A#foo3#' + results.join('#');
    }
};

var B = {
    foo: function () {
        return 'B#foo';
    },

    foo1: function () {
        return 'B#foo1';
    },

    foo2: function () {
        return 'B#foo2';
    },

    foo3: function () {
        return 'B#foo3';
    }
};

var C = {
    foo: function () {
        return 'C#foo';
    },

    foo1: function () {
        return 'C#foo1';
    },

    foo2: function () {
        return 'C#foo2';
    },

    foo3: function () {
        return 'C#foo3';
    }
};

describe('Conflict resolution', function () {
    var compose = require('../src/compose-with-conflict-resolution');

    it('resolve conflicts', function () {
        var Meta = compose(A, B, C, {
            after: 'foo1'
        });
        var meta = Object.create(Meta);

        expect(meta.foo()).to.equal('A#foo');
        expect(meta.foo1()).to.equal('C#foo1');
    });

    function metaFactory(policies) {
        var Meta = compose(A, B, C, policies);
        return Object.create(Meta);
    }

    it('use overwrite policy', function () {
        var meta = metaFactory({overwrite: ['foo', 'foo1']});

        expect(meta.foo()).to.equal('A#foo');
        expect(meta.foo1()).to.equal('A#foo1');
    });

    it('use discard policy', function () {
        var meta = metaFactory({discard: ['foo', 'foo1']});

        expect(meta.foo()).to.equal('C#foo');
        expect(meta.foo1()).to.equal('C#foo1');
    });

    it('use before policy', function () {
        var meta = metaFactory({before: ['foo', 'foo1', 'foo2', 'foo3']});

        expect(meta.foo()).to.equal('A#foo');
        expect(meta.foo1()).to.equal('A#foo1');
        expect(meta.foo2()).to.equal('B#foo2');
    });

    it('use after policy', function () {
        var meta = metaFactory({after: ['foo', 'foo1', 'foo2', 'foo3']});

        expect(meta.foo()).to.equal('C#foo');
        expect(meta.foo1()).to.equal('C#foo1');
        expect(meta.foo2()).to.equal('C#foo2');
    });

    it('use around policy', function () {
        var meta = metaFactory({around: ['foo', 'foo1', 'foo2', 'foo3']});

        expect(meta.foo3()).to.equal('A#foo3#B#foo3#C#foo3');
    });

    it('overwrite default policy', function () {
        var meta = metaFactory({discard: '*'});

        expect(meta.foo()).to.equal('C#foo');
        expect(meta.foo1()).to.equal('C#foo1');
    });

    it('Hobbit', function () {
        var Person = require('./models/hobbits').Person;
        var Profession = require('./models/hobbits').Profession;
        var RingKeeper = require('./models/hobbits').RingKeeper;

        Person = _.assign({}, Person, {dependencies: ['profession']});

        var Hobbit = compose(Person, Profession, RingKeeper, {});
        var bilbo = Object.create(Hobbit);

        expect(bilbo).to.respondTo('name');

        bilbo.setName('Bilbo Baggins');
        bilbo.setProfession('Burglar');
        expect(bilbo.description()).to.be.equal('Bilbo Baggins the Burglar');
        expect(bilbo.disappear.bind(bilbo)).to.not.throw(Error);
        console.log('b', bilbo);
    });
});
