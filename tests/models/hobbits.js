module.exports = {
    Person: {
        setName: function (name) {
            this._name = name;
        },

        name: function () {
            return this._name;
        },

        description: function () {
            return this.name() + ' the ' + this.profession();
        }
    },

    Profession: {
        setProfession: function (profession) {
            this._profession = profession;
        },

        profession: function () {
            return this._profession;
        }
    },

    RingKeeper: {
        disappear: function () {
            this._ringOn();
        },

        _ringOn: function () {
            this._isInvisible = true;
        }
    },
};
