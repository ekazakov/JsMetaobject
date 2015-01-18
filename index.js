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
