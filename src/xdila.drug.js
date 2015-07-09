XDila.Drug = function (name, base_price_from, base_price_to, show_chance, special_events) {
    this.name = name;
    this.internal_name = '';

    this.amount = 0;
    this.price  = 0; // only for local purposes

    this.base_price_from = base_price_from;
    this.base_price_to = base_price_to;
    this.show_chance = show_chance;
    this.special_events = special_events;

    this.willShowToday = function (game) {
        return Math.random() <= this.show_chance;
    };

    // it has game object so it could pass the aessage to UI directly
    this.getPrice = function (game) {
        var self = this;
        var price = Math.floor(Math.random() * (this.base_price_to - this.base_price_from) + this.base_price_from);
        if (typeof(this.special_events) !== 'undefined' && this.special_events) {
            if (typeof(this.special_events) == 'function') {
                this.special_events = {'_native': this.special_events};
            }
            $.each(this.special_events, function (id, callable) {
                var result = callable(game,price,self.name);
                if (parseInt(result) != 0) {
                    if (id == '_native') {
                        price = result;
                    } else {
                        price += result;
                        if (price < 1) {
                            // safety check, reverse rule
                            price -= result;
                        }
                    }
                }
            });
        }
        return price;
    }
};