var __slice = [].slice;

var StackMaker = (function () {
    return {
        array: [],
        undoStack: [],

        push: function (value) {
            this.undoStack.push(function () {
                this.array.pop();
            });

            return this.array.push(value);
        },

        pop: function () {
            var popped = this.array.pop();
            this.undoStack.push(function () {
                this.array.push(popped);
            });

            return popped;
        },

        isEmpty: function () {
            return this.array.length === 0;
        },

        undo: function () {
            this.undoStack.pop().call(this);
        }
    };
});


function delegateToOwn (receiver, propertyName, methods) {
    var tmpMetaobject;

    if (methods == null) {
        tmpMetaobject = receiver[propertyName];

        methods = Object.keys(tmpMetaobject).filter(function (methodName) {
            return typeof tmpMetaobject[methodName] === 'function';
        });
    }

    methods.forEach(function (methodName) {
        receiver[methodName] = function () {
            var metaobject = receiver[propertyName];
            return metaobject[methodName].apply(receiver, arguments);
        };
    });
}

var o1 = {
    doo: function () {
        console.log('o1:doo ->', this.x);
        return this.x;
    }
};

var o2 = {
    doo: function () {
        console.log('o2:doo ->', this.x);
        return this.x;
    }
};

var dooer = {
    x: 1,
    obj: o1
};

delegateToOwn(dooer, 'obj', ['doo']);
console.group('delegateToOwn');
dooer.doo();
dooer.obj = o2;
dooer.doo();
console.groupEnd();




function proxy (base, optionalProto) {
    var proxyObject = Object.create(optionalProto || null);

    Object.keys(base).forEach(function (methodName) {
        if (typeof base[methodName] === 'function') {
            proxyObject[methodName] = function () {
                var result = base[methodName].apply(base, arguments);

                return (result === base) ? proxyObject : result;
            };
        }
    });

    return proxyObject;
}

console.group('Proxy');
var stack = StackMaker();

var stackProxy = proxy(stack);
stackProxy.push('x');
stackProxy.push('y');

console.log('stackProxy.array:', stackProxy.array);
console.log('stack.array:', stack.array);
console.log('stackProxy.isEmpty:', stackProxy.isEmpty());

console.groupEnd();

function meld () {
    var melded = {},
        providers = __slice.call(arguments, 0),
        key,
        i,
        provider;

    for (i = 0; i < providers.length; ++i) {
        provider = providers[i];
        for (key in provider) {
            if (provider.hasOwnProperty(key)) {
                melded[key] = provider[key];
            }
        }
    }
    return melded;
}



console.group('Prevent extension');

function Record (template) {
    if (Record.prototype.isPrototypeOf(this)) {
        var struct = this;

        Object.keys(template).forEach(function (key) {
            Object.defineProperty(struct, key, {
                enumerable: true,
                writable: true,
                value: template[key]
            });
        });

        return Object.preventExtensions(struct);
    } else return new Record(template);
}

function addCurrency(amount, currency) {
  "use strict";

  amount.currency = currency;
  return currency;
}

var rentAmount = Record({dollars: 420, cents: 0});

console.log('rent amount', rentAmount);

try {
    addCurrency(rentAmount, "CAD");
} catch (e) {
    console.log(e);
}

function Value (template) {

  if (Value.prototype.isPrototypeOf(this)) {
    var immutableObject = this;

    Object.keys(template).forEach(function (key) {
      Object.defineProperty(immutableObject, key, {
        enumerable: true,
        writable: false,
        value: template[key]
      });
    });
    return Object.preventExtensions(immutableObject);
  }
  else return new Value(template);
}

Value.prototype = new Record({});

function copyAmount(to, from) {
    'use strict';

    to.dollars = from.dollars;
    to.cents = from.cents;
}

var rentValue = Value({dollars: 1000, cents: 0});

try {
    copyAmount(rentValue, rentAmount);
} catch (e) {
    console.log(e);
}
console.groupEnd();


console.group('Original');
var original = function (unknown) {
    return unknown.constructor(unknown);
};

console.log('original(new Boolean(true)) === true is ', original(new Boolean(true)) === true);
console.groupEnd();


console.group('Guarded functions');

function nameAndLength (name, length, body) {
    var abcs = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p',
                'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l',
                'z', 'x', 'c', 'v', 'b', 'n', 'm'];

    var pars = abcs.slice(0, length);

    var src = '(function ' + name + ' (' + pars.join(',') +
        ') { return body.apply(this, arguments); })';

    return eval(src);
}

function imitate (exemplar, body) {
    return nameAndLength(exemplar.name, exemplar.length, body);
}

function when (guardFn, optionalFn) {
    function guarded (fn) {
        return imitate(fn, function () {
            if (guardFn.apply(this, arguments))
                return fn.apply(this, arguments);
        });
    }

    return optionalFn == null ? guarded : guarded(optionalFn);
}

var whenIsNotNull = when(function (x) { return x != null; });
var safeHelloWorld = whenIsNotNull(function () {return "Hello world!"; });

console.log(safeHelloWorld());
console.log(safeHelloWorld(1));


function getWith (prop, obj) {
    function gets (obj) {
        return obj[prop];
    }

    return obj == null ? gets : gets(obj);
}

function mapWith (fn, mappable) {
    function maps (collection) {
        return collection.map(fn);
    }

    return mappable == null ? maps : maps(mappable);
}

function pluckWith(prop, collection) {
    var plucker = mapWith(getWith(prop));

    return collection == null ? plucker : plucker(collection);
}


function Match () {
    var fns     = [].slice.call(arguments, 0),
        lengths = pluckWith('length', fns),
        length  = Math.min.apply(null, lengths),
        names   = pluckWith('name', fns).filter(function (name) { return name !== ''; }),
        name    = names.length === 0 ? '' : names[0];

    return nameAndLength(name, length, function () {
        var i, value;

        for (i in fns) {
            value = fns[i].apply(this, arguments);

            if (value != null) return value;
        }
    });
}

function equals (x) {
    return function eq (y) { return x === y; };
}

function not (fn) {
    var name = fn.name === '' ? 'not' : 'not_' + fn.name;

    return nameAndLength(name, fn.length, function () {
        return !fn.apply(this, arguments);
    });
}

var worstTestForEven = Match(
    when(equals(0), function (n) { return true; }),
    when(equals(1), function (n) { return false; }),
    function (n) { return worstTestForOdd(n - 1); }
);

var worstTestForOdd = Match(
    when(equals(0), function (n) { return false; }),
    when(equals(1), function (n) { return true; }),
    function (n) { return worstTestForEven(n - 1); }
);

console.groupEnd();


var extend = meld;

function extendPrivately (receiver, mixin) {
    var privateProperty = Object.create(null);

    Object.keys(mixin).forEach(function (methodName) {
        receiver[methodName] = mixin[methodName].bind(privateProperty);
    });

    return receiver;
}

function forward (receiver, metaobject, methods) {
    if (methods == null) {
        methods = Object.keys(metaobject).filter(function (methodName) {
            return typeof metaobject[methodName] === 'function';
        });
    }

    methods.forEach(function (methodName) {
        receiver[methodName] = function () {
            var result = metaobject[methodName].apply(metaobject, arguments);

            return result === metaobject ? this : result;
        };
    });

    return receiver;
}

function delegate (receiver, metaobject, methods) {
    if (methods == null) {
        methods = Object.keys(metaobject).filter(function (methodName) {
            return typeof metaobject[methodName] === 'function';
        });
    }

    methods.forEach(function (methodName) {
        receiver[methodName] = function () {
            return metaobject[methodName].apply(receiver, arguments);
        };
    });

    return receiver;
}

function delegateToOwn (receiver, propertyName, methods) {
    var temporaryMetaobject;

    if (methods == null) {
        temporaryMetaobject = receiver[propertyName];
        methods = Object.keys(temporaryMetaobject).filter(function (methodName) {
            return typeof(temporaryMetaobject[methodName]) == 'function';
        });
    }
    methods.forEach(function (methodName) {
        receiver[methodName] = function () {
            var metaobject = receiver[propertyName];
            return metaobject[methodName].apply(receiver, arguments);
        };
    });

    return receiver;
}

var Person = {
    setName: function (first, last) {
        this._firstName = first;
        this._lastName= last;
        return this;
    },

    fullName: function () {
        return this._firstName + " " + this._lastName;
    },

    rename: function (first, last) {
        this._firstName = first;
        this._lastName = last;
        return this;
    }
};

var IsAuthor = {
    constructor: function (defaults) {
        defaults = defaults || {};
        this._books = defaults.books || [];
        return this;
    },

    addBook: function (name) {
        this._books.push(name);
        return this;
    },

    books: function () {
        return this._books;
    }
};

var HasChildren = {
    constructor: function (defaults) {
        this._children = defaults.children || [];
        return this;
    },

    addChild: function (name) {
        this._children.push(name);
        return this;
    },

    numberOfChildren: function () {
        return this._children.length;
    }
};

var HasAlias = {
    constructor: function (defaults) {
        defaults = defaults || {};
        this._alias = defaults.alias;
        return this;
    },

    nomDePlue: function () {
        return this._alias.fullName();
    }
};

function sequence (fn1, fn2) {
    return function () {
        fn1.apply(this, arguments);

        return fn2.apply(this, arguments);
    };
}

function extendAfter (consumer) {
    var providers = __slice.call(arguments, 1);

    providers.forEach(function (provider) {
        Object.keys(provider).forEach(function (key) {
            if (consumer[key] == null) {
                consumer[key] = provider[key];
            } else {
                consumer[key] = sequence(consumer[key], provider[key]);
            }
        });
    });

    return consumer;
}


console.group('extendAfter');

var raganwald = extendAfter({}, Person, IsAuthor, HasChildren);

raganwald.constructor({
    books: ['book1', 'book2'],
    children: ['child 1', 'child 2']
});


var wheeler = extend({}, Person, IsAuthor)
    .constructor({
        books: ['Cycle your way to happiness']
    })
    .setName('Reggie', 'Wheelser')
;

console.groupEnd();

console.group('extendAround');

function around (fn1, fn2) {
    return function () {
        var argArray = [fn1.bind(this)].concat(arguments, 1);
        return fn2.apply(this, argArray);
    };
}

function extenAround (consumer) {
    var providers = __slice.call(arguments, 1);

    providers.forEach(function (provider) {
        Object.keys(provider).forEach(function (key) {
            if (consumer[key] == null) {
                consumer[key] = provider[key];
            } else {
                consumer[key] = around(consumer[key], provider[key]);
            }
        });
    });

    return consumer;
}

console.groupEnd();

var policies = {
    overwrite: function overwrite (fn1, fn2) {
        return fn1;
    },

    discard: function discard (fn1, fn2) {
        return fn2;
    },

    before: function before (fn1, fn2) {
        return function () {
            var fn1value = fn1.apply(this, arguments);
            var fn2value = fn2.apply(this, arguments);

            return fn2value != null ? fn2value : fn1value;
        };
    },

    after: function after (fn1, fn2) {
        return function () {
            var fn2value = fn2.apply(this, arguments);
            var fn1value = fn1.apply(this, arguments);

            return fn2value != null ? fn2value : fn1value;
        };
    },

    around: function around (fn1, fn2) {
        return function () {
            var argArray = [fn1.bind(this)].concat(__slice.call(arguments, 0));
            return fn2.apply(this, argArray);
        }
    }
};

function inverse (hash) {
    return Object.keys(hash).reduce(function (inversion, policyName) {
        var methodNameOrNames = hash[policyName];

        if (typeof methodNameOrNames === 'string') {
            inversion[methodNameOrNames] = policies[policyName];
        } else if (typeof methodNameOrNames.forEach === 'function') {
            methodNameOrNames.forEach(function (methodName) {
                inversion[methodName] = policies[policyName];
            });
        }

        return inversion;
    }, {});
}

function mixinWithPolicy (provider, policyDefinition) {
    var policiesByMethodName = inverse(policyDefinition || {});
    var defaultPolicy = policies.overwrite;

    if (policiesByMethodName['*'] != null) {
        defaultPolicy = policiesByMethodName['*'];
        delete policiesByMethodName['*'];
    }

    return function (receiver) {
        receiver = receiver || {};

        Object.keys(provider).forEach(function (key) {
            if (receiver[key] == null) {
                receiver[key] = provider[key];
            } else if (policiesByMethodName[key] != null && policiesByMethodName.hasOwnProperty(key)) {
                receiver[key] = policiesByMethodName[key](receiver[key], provider[key]);
            } else {
                receiver[key] = defaultPolicy(receiver[key], provider[key]);
            }
        });

        return receiver;
    };
}

var IsPerson = mixinWithPolicy({
    setName: function (first, last) {
        this._firstName = first;
        this._lastName= last;
        return this;
    },

    fullName: function () {
        return this._firstName + " " + this._lastName;
    },

    rename: function (first, last) {
        this._firstName = first;
        this._lastName = last;
        return this;
    }
});

var IsAuthor = mixinWithPolicy({
    constructor: function (defaults) {
        defaults = defaults || {};
        this._books = defaults.books || [];
        return this;
    },

    addBook: function (name) {
        this._books.push(name);
        return this;
    },

    books: function () {
        return this._books;
    }
}, {after: '*'});

var HasChildren = mixinWithPolicy({
    constructor: function (defaults) {
        defaults = defaults || {};
        this._children = defaults.children || [];
        return this;
    },

    addChild: function (name) {
        this._children.push(name);
        return this;
    },

    numberOfChildren: function () {
        return this._children.length;
    }
}, {after: '*'});

var gwen = IsAuthor(HasChildren(IsPerson()));
gwen.constructor({
    books: ['the little black cloud'],
    children: ['reginald', 'celeste', 'chris']
});

console.log(gwen);

var HasAlias = mixinWithPolicy({
    constructor: function (defaults) {
        defaults = defaults || {};
        this._alias = defaults.alias;
        return this;
    },

    nomDePlume: function () {
        return this._alias.fullName();
    },

    books: function (authorBooks) {
        return authorBooks().concat(this._alias.books());
    }
}, {after: '*', around: 'books'});

var wheeler = IsAuthor(IsPerson()).constructor({
    books: ['Cycle your way to happiness']
}).setName('Reggie', 'Wheeler');

var raganwald2 = HasAlias(IsAuthor(HasChildren(IsPerson())));
raganwald2.constructor({
    alias: wheeler,
    books: ['JavaScript Spessore', 'JavaScript Allongé'],
    children: ['Thomas', 'Clara']
});


console.group('privateExtendWithSelf');

function privateExtendWithSelf (receiver, mixin) {
    var privateProperty = Object.create(null);

    privateProperty.self = receiver;

    Object.keys(mixin).forEach(function (methodName) {
        receiver[methodName] = mixin[methodName].bind(privateProperty);
    });

    return receiver;
}

var Container = {
    initialize: function () {
        this._contents = [];
        return this.self;
    },

    add: function (something) {
        this._contents.push(something);
    },

    size: function () {
        return this._contents.length;
    },

    description: function () {
        return "I'm a bag with " + this.self.size() + " things in it."
    }
};


var bag = privateExtendWithSelf({}, Container)
    .initialize();
bag.add('something');

console.log(bag.description());
console.groupEnd();
