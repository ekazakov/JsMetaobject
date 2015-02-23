var MetaObjectPrototype = {
    create: function () {
        var instance = Object.create(this.prototype);

        if (instance.constructor) {
            instance.constructor.apply(instance, arguments);
        }

        return instance;
    },

    defineMethod: function (name, body) {
        this.prototype[name] = body;
        return this;
    },

    constructor: function (superclass) {
        if (superclass != null && superclass.prototype != null) {
            this.prototype = Object.create(superclass.prototype);
        } else {
            this.prototype = Object.create(null);
        }
    }
};

var MetaClass = {
    create: function () {
        var klass = Object.create(this.prototype);

        // Object.defineProperty(klass, 'constructor', {
        //     value: this
        // });

        if (klass.constructor) {
            klass.constructor.apply(klass, arguments);
        }

        return klass;
    },

    prototype: MetaObjectPrototype
};


module.exports = MetaClass;
