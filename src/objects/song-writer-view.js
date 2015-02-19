module.exports = {
    constructor: function (model, name, spy) {
        this.model = model;
        this.name = name;
        this.spy = spy;
        this.model.subscribe(this.render.bind(this));
        return this;
    },

    _englishList: function (list) {
        var butLast = list.slice(0, -1);
        var last = list.slice(-1);

        return butLast.length > 0 ?
            [butLast.join(', '), last].join(' and ') : last;
    },

    render: function () {
        var songList  = this.model.songs().length > 0 ?
            [" has written " + this._englishList(this.model.songs().map(function (song) {
                return "'" + song + "'";
            }))] : [];

        this.spy(this.name + songList);
        console.log(this.name + songList);
        return this;
    }
};
