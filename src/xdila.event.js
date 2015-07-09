XDila.Event = function (name, caller, args) {
    this.name = name;
    this._caller = caller;
    this.args = args;

    this.caller = function () {
        return this._caller;
    }
}