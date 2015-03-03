var encapsulate = require('../encapsulate');

module.exports = encapsulate({
    constructor: function () {
        this._subscribers = [];
        return this.self;
    },

    subscribe: function (callback) {
        this._subscribers.push(callback);
    },

    unsubscribe: function (callback) {
        this._subscribers = this._subscribers.filter( function (subscriber) {
            return subscriber !== callback;
        });
    },

    subscribers: function () {
        return this._subscribers;
    },

    notify: function () {
        var receiver = this;

        this._subscribers.forEach( function (subscriber) {
            subscriber.apply(receiver.self, arguments);
        });
    }
});
