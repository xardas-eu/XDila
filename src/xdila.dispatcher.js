// really really simple event dispatcher
XDila.Dispatcher = function () {
    this.events = {};
    this.register = function (event, callable) {
        if (typeof(this.events[event]) == 'undefined') {
            this.events[event] = [];
        }
        this.events[event].push(callable);
    };

    this.unregister = function (event) {
        this.events[event] = [];
        return this
    };

    this.emit = function (event) {
        if (typeof(this.events[event.name]) !== 'undefined' && this.events[event.name].length) {
            //iterate over events
            $.each(this.events[event.name], function (k, handler) {
                handler(event); // really simple
            });

        }

    }
};
