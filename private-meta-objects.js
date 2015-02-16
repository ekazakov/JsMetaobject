var __slice = Array.prototype.slice;

function extend () {
    var melded = {},
        providers = __slice.call(arguments, 0),
        key,
        i,
        provider;

    for (i = 0; i < providers.length; ++i) {
        provider = providers[i];
        for (key in provider) {
            if (Object.prototype.hasOwnProperty.call(provider, key)) {
                melded[key] = provider[key];
            }
        }
    }
    return melded;
}

function methodsOfType (behaviour, type) {
    return Object.keys(behaviour).filter(function (methodName) {
        return typeof behaviour[methodName] === type;
    });
}

function isUndefined (value) {
    return typeof value === 'undefined';
}

function isntUndefined (value) {
    return typeof value !== 'undefined';
}

function isFunction (value) {
    return typeof value === 'function';
}

function orderProtocol () {
    if (arguments.length === 1) return arguments[0];

    var fns = arguments;

    return function composed () {
        for (var i = 0; i < (fns.length - 1); ++i) {
            fns[i].apply(this, arguments);
        }

        return fns[fns.length - 1].apply(this, arguments);
    };
}

function propertiesToArrays (metaobjects) {
    return metaobjects.reduce(function (collected, metaobject) {
        Object.keys(metaobject).forEach(function (key) {
            if (Object.prototype.hasOwnProperty.call(collected, key)) {
                collected[key].push(metaobject[key]);
            } else {
                collected[key] = [metaobject[key]];
            }

        });

        return collected;
    }, Object.create(null));
}

function resolveUndefineds (collected) {
    return Object.keys(collected).reduce(function (resolved, key) {
        var values = collected[key];

        if (values.every(isUndefined)) {
            resolved[key] = undefined;
        } else {
            resolved[key] = values.filter(isntUndefined);
        }

        return resolved;
    }, {});
}

function applyProtocol (resolveds, protocol) {
    return Object.keys(resolveds).reduce(function (applied, key) {
        var value = resolveds[key];

        if (isUndefined(value)) {
            applied[key] = value;
        } else if (value.every(isFunction)) {
            applied[key] = protocol.apply(null, value);
        } else {
            throw "Don't know what to do with";
        }

        return applied;
    }, {});
}

function composeMetaobjects () {
    var metaobjects = __slice.call(arguments, 0);
    var arrays = propertiesToArrays(metaobjects);
    var resolved = resolveUndefineds(arrays);

    return applyProtocol(resolved, orderProtocol);
}

function proxy (baseObject, methods, optionalPrototype) {
    var proxyObject = Object.create(optionalPrototype || null);

    methods = methods || methodsOfType(baseObject, 'function');

    methods.forEach(function (methodName) {
        proxyObject[methodName] = function () {
            var result = baseObject[methodName].apply(baseObject, arguments);

            return result === baseObject ? proxyObject : result;
        };
    });

    return proxyObject;
}

var privateStateId = 0;

function extendWithProxy (baseObject, behaviour) {
    var safekeepingName = '__' + (++privateStateId) + '__';

    var methods = methodsOfType(behaviour, 'function');
    var dependencies = methodsOfType(behaviour, 'undefined');

    var privateMethods = methods.filter(function (methodName) {
        return methodName[0] === '_';
    });

    var publicMethods = methods.filter(function (methodName) {
        return methodName[0] !== '_';
    });

    function createContext (methodReceiver) {
        var proto = privateMethods.reduce(function (acc, methodName) {
            acc[methodName] = behaviour[methodName];

            return acc;
        }, {});

        var innerProxy = proxy(methodReceiver, dependencies, proto);

        return Object.defineProperty(innerProxy, 'self', {
            writable: false,
            enumerable: false,
            value: methodReceiver
        });
    }

    function getContext (methodReceiver) {
        var context = methodReceiver[safekeepingName];

        if (context == null) {
            context = createContext(methodReceiver);
            Object.defineProperty(methodReceiver, safekeepingName, {
                enumerable: false, writable: false, value: context
            });
        }

        return context;
    }

    return publicMethods.reduce(function (acc, methodName) {
        var methodBody = behaviour[methodName];

        acc[methodName] = function () {
            var context = getContext(this);
            var result = methodBody.apply(context, arguments);

            return (result === context) ? this : result;
        };

        return acc;
    }, {});
}

function encapsulate (behaviour) {
    return extendWithProxy(Object.create(null), behaviour);
}

var Person = encapsulate({
    fullName: function () {
        return this.firstName + " " + this.lastName;
    },
    rename: function (first, last) {
        this.firstName = first;
        this.lastName = last;
        return this;
    }
});

var HasCareer = encapsulate({
    career: function () {
        return this.chosenCareer;
    },
    setCareer: function (career) {
        this.chosenCareer = career;
        return this;
    },
    // describe: function () {
        // return this.fullName() + " is a " + this.chosenCareer;
    // }
});

var HasName = encapsulate({
    setName: function (name) {
        this._name = name;
    },

    name: function () {
        return this._name;
    }
});




var IsSelfDescribing = encapsulate({
    name: undefined,
    career: undefined,

    description: function () {
        return this.name() + ' is a ' + this.career();
    }
});


var MultiTalented = encapsulate({
  _englishList: function (list) {
    var butLast = list.slice(0, list.length - 1),
        last = list[list.length - 1];
    return butLast.length > 0
           ? [butLast.join(', '), last].join(' and ')
           : last;
  },
  constructor: function () {
    this._careers = [];
    return this;
  },
  addCareer: function (career) {
    this._careers.push(career);
    return this;
  },
  careers: function () {
    return this._englishList(this._careers);
  }
});


var SingsSongs = encapsulate({
  _songs: null,

  constructor: function () {
    this._songs = [];
    return this;
  },
  addSong: function (name) {
    this._songs.push(name);
    return this;
  },
  songs: function () {
    return this._songs;
  }
});

var HasAwards = encapsulate({
  _awards: null,

  constructor: function () {
    this._awards = [];
    return this;
  },
  addAward: function (name) {
    this._awards.push(name);
    return this;
  },
  awards: function () {
    return this._awards;
  }
});
