XDila.Player = function (name,game) {
    this.game = game;
    this.name = name;
    this.health = 100;
    this.respect = 10;
    this.currentCity = null;
    this.capacity = 100;


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


    this.sellDrugs = function(drug,amount,price) {
        var gain = amount * price;
        var drug = this.drugs[drug.internal_name];

        if(drug.amount<amount) {
            this.game.UI.notify('Not enough drugs for the deal man','error');
            return false;
        }

        drug.amount -= amount;
        if(drug.amount==0) {
            delete this.drugs[drug.internal_name];
        }

        this.Bank.freeCash(gain);
        this.update();
        return true;
    };


    this.dropDrugs = function(drug,amount) {
        if(drug.amount<amount) {
            this.game.UI.notify('Not enough drugs for the deal man','error');
            return false;
        }

        drug.amount -= amount;
        if(drug.amount==0) {
            delete this.drugs[drug.internal_name];
        }
        this.update();
        return true;
    };



    this.buyDrugs = function(drug,amount,price,fake) {
        fake = fake || false;

        // account validation first
        var cost = amount*price;
        if(!this.Bank.canPayCash(cost) && !fake) {
            this.game.UI.notify('Not enough money for the deal man','error');
            return false;
        }
        if(!this.hasCapacity(amount) && !fake) {
            this.game.UI.notify('Not enough space for the drugs','error');
            return false;
        }

        this.Bank.payCash(cost);

        if(typeof(drug)=='object') {
            drug = drug.internal_name;
        }

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
        this.update();

    };

    this.getUsedCapacity = function() {
        var amount = 0;
        $.each(this.drugs, function (internal_name, drug) {
            amount+= drug.amount
        });
        return amount;
    };


    this.getRemainingCapacity = function() {
        return (this.capacity - this.getUsedCapacity());
    }

    this.hasCapacity = function(amount) {
        return this.getRemainingCapacity()>=amount;
    }

    // bonus
    this.increase = function (amount) {
      this.capacity += amount;
        this.update();
    };


    this.init = function(game) {//reset
        this.game = game;
        this.health = 100;
        this.respect = 10;
        this.capacity = 100;


        this.currentCity = null;
        this.Bank = new XDila.Bank(this);
        this.drugs = {};
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