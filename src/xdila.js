var XDila = function (days_limit) {
    this.components = [
        'xdila.events', 'xdila.city',  'xdila.dispatcher', 'xdila.drug', 'xdila.event', 'xdila.gang', 'xdila.player', 'xdila.ui', 'xdila.utils', 'xdila.bank',
        'xdila.drugs'
    ];

    var self = this;
    $.each(this.components, function (k, component) {
        $.ajax({
            url: 'src/' + component + '.js',
            async: false,
            dataType: "script"
        });
    });

    this.dispatcher = new XDila.Dispatcher();
    this.UI = new XDila.UI();

    this.rootElement = null;
    this.day = 0;
    this.days_limit = days_limit || 365;
    this.cities = {};
    this.drugs = {};

    this.player = null;

    this.createOwnDrugTable = function () {
        var data = {};
        var self = this;

        $.each(this.Player.drugs, function (internal_name, drug) {
            data[internal_name] = {'name':drug.name, 'amount': drug.amount, 'price':drug.price}
        });

        return data;
    };

    this.createCityDrugTable = function () {
        var data = {};
        var self = this;

        $.each(this.drugs, function (internal_name, drug) {
            if(drug.willShowToday(self)) {
                data[internal_name] = {'name':drug.name,'price':drug.getPrice(self)}
            }
        });
        return data;
    };

    this.setPlayer = function (player) {
        if (player instanceof XDila.Player) {
            this.Player = player;
        } else {
            throw "Passed argument should be an instance of XDila.Player!";
        }
    }

    this.addDrug = function (internal_name, drug) {
        if (drug instanceof XDila.Drug) {
            drug.internal_name = internal_name;
            this.drugs[drug.internal_name] = drug;
        } else {
            throw "Passed argument should be an instance of XDila.Drug!";
        }
    }

    this.addCity = function (internal_nane, city) {
        if (city instanceof XDila.City) {
            city.internal_name = internal_nane;
            this.cities[city.internal_name] = city;
        } else {
            throw "Passed argument should be an instance of XDila.City!";
        }
    };

    this.goToCity = function (city) {
        this.dispatcher.emit(new XDila.Event('player.change-city.before', this, {
            old_city: this.Player.currentCity,
            new_city: city
        }));

        if (!this.Player.setCity(city)) {
            return false;
        }
        // new city = new day
        this.nextDay();
        this.dispatcher.emit(new XDila.Event('player.change-city.after', this, {new_city: city}));
    };


    this.nextDay = function () {
        this.dispatcher.emit(new XDila.Event('game.new-day.before', this, {previous_day: this.day}));
        if ((this.day + 1) <= this.days_limit) {
            this.day++;
        } else {
            bootbox.alert('you won bro and this is not yet handled');
        }
        this.UI.nextDay();
        this.dispatcher.emit(new XDila.Event('game.new-day.after', this, {
            current_day: this.day,
            current_city: this.Player.currentCity
        }));
    };

    this._startingCash = 200;
    this._startingLoan = 150;

    this.start = function (root) {
        this.rootElement = root;
        this.day = 0;
        this.UI.start(root, this);
        this.Player.init(this);

        this.Player.Bank.freeCash(this._startingCash);
        this.Player.Bank.studentLoan(this._startingLoan);

        // set the player in the first city
        this.goToCity(this.cities[Object.keys(this.cities)[0]]);
    }
};