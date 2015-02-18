var encapsulate = require('../encapsulate');

module.exports = encapsulate({
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
