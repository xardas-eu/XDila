XDila.Player = function (name,game) {
    this.game = game;
    this.name = name;
    this.health = 100;
    this.respect = 10;
    this.currentCity = null;


    this.Bank = new XDila.Bank(this);

    this.drugs = {};

    /**
     *
     * @type XDila
     */
    this.game = null;

    this.decreaseLife = function(hp,msg) {
        if(this.health-hp < 1) {
            this.dead();
        }

        this.health -= hp;
        this.update();
        if(msg) {
            this.game.UI.notify(msg,'error');
        }
    };

    this.heal = function(hp) {
       this.health = hp;
        this.update();
    };

    this.dead = function() {
        // i dunno
        this.game.gameOver(); // ???
    }

    this.buyDrugs = function(drug,amount,price) {
        if(typeof(this.drugs[drug])=='undefined') {
            this.drugs[drug] = jQuery.extend({},this.game.drugs[drug]);
            this.drugs[drug].amount = amount;
            this.drugs[drug].price = price;
        } else {
            // calc average
            var newPrice = XDila.Utils.calculateAverageDrugPrice(this.drugs[drug].amount,this.drugs[drug].price,amount,price);
            this.drugs[drug].amount += amount;
            this.drugs[drug].price   = newPrice;
        }

        // should it do ui update? perhaps it should. not for now though.
        // @TODO think anbout this

    };

    this.init = function(game) {
        this.game = game;

        // lets buy fake drugs for noww
        this.buyDrugs('grass',26,17);


        this.update();
    }

    this.update = function() {
        var drugs = this.game.createOwnDrugTable();
        var UI = this.game.UI;
        UI.renderOwnDrugTab(drugs);
        UI.update();
    };


    this.addOrTakeRespect = function(respect) {
        this.respect += respect;
        this.update();
    };

    this.setCity = function (city) {
        if (city instanceof XDila.City) {

            if(city===this.currentCity) {
                return false;
            }

            this.currentCity = city;
            return true;
        } else {
            throw "Passed argument should be an instance of XDila.City!";
        }
    }
};

XDila.Player.Inventory = function () {

}