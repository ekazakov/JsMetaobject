var Person = {
    fullName: function () {
        return this.firstName + " " + this.lastName;
    },
    rename: function (first, last) {
        this.firstName = first;
        this.lastName = last;
        return this;
    }
};

var HasName = {
  name: function () {
    return this.name;
  },
  setName: function (name) {
    this.name = name;
    return this;
  }
};

var IsSelfDescribing = {
  description: function () {
    return this.name() + ' is a ' + this.career();
  }
};

var HasCareer = {
    career: function () {
        return this.chosenCareer;
    },
    setCareer: function (career) {
        this.chosenCareer = career;
        return this;
    },
    describe: function () {
        return this.fullName() + " is a " + this.chosenCareer;
    }
};

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

function proxy (baseObject, optionalPrototype) {
    var proxyObject = Object.create(optionalPrototype || null);

    Object.keys(baseObject).forEach(function (methodName) {
        if (typeof baseObject[methodName] === 'function') {
            proxyObject[methodName] = function () {
                var result = baseObject[methodName].apply(baseObject, arguments);

                return result === baseObject ? proxyObject : result;
            };
        }
    });

    return proxyObject;
}

var privateStateId = 0;

function extendWithProxy (baseObject, behaviour) {
    var safekeepingName = '__' + (++privateStateId) + '__';

    function createContext (methodReceiver) {
        return Object.defineProperty(proxy(methodReceiver), 'self', {
            writable: false,
            enumerable: false,
            value: methodReceiver
        });
        // return proxy(methodReceiver);
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

    Object.keys(behaviour).forEach(function (methodName) {
        var methodBody = behaviour[methodName];

        baseObject[methodName] = function () {
            var context = getContext(this);
            var result;

            result = methodBody.apply(context, arguments);
            return (result === context) ? this : result;
        };
    });

    return baseObject;
}

function encapsulate (behaviour) {
    return extendWithProxy(Object.create(null), behaviour);
}

Person = encapsulate({
    fullName: function () {
        return this.firstName + " " + this.lastName;
    },
    rename: function (first, last) {
        this.firstName = first;
        this.lastName = last;
        return this;
    }
});

HasCareer = encapsulate({
    career: function () {
        return this.chosenCareer;
    },
    setCareer: function (career) {
        this.chosenCareer = career;
        return this;
    },
    describe: function () {
        return this.fullName() + " is a " + this.chosenCareer;
    }
});
