XDila.Bank = function (player) {
    this.player = player;
    this.game   = player.game;

    this._debtInterest = 0.04;
    this._bankInterest = 0.01;

    this.cash = 0;
    this.bank = 0;
    this.debt = 0;


    this.game.dispatcher.register('game.new-day.before',function(event){
        // CAPITALIZE
        var self = event.caller().Player.Bank;
        self.bank                   += Math.floor(self.bank*self._bankInterest);
        self.debt                   += Math.ceil(self.debt*self._debtInterest);
        event.caller().UI.update();
    });


    this.update = function() {
        this.game.UI.update();
    };


    this.repo     = function(amount,msg) { // :(
        if(this.bank+this.cash < amount) {
            return false; // bankrupcy
        }

        if(this.cash<amount) {
            amount -= this.cash;
            this.cash = 0;
        }

        if(this.cash) {
            this.cash -= amount;
            amount = 0;
        }

        if(amount) {
            this.bank -= amount;
            amount = 0;
        }

        if(msg) {
            this.game.UI.notify(msg,'error');
        }

        this.game.UI.update();
        return true;

    }

    this.studentLoan = function(amount) {
        this.debt += amount;
        this.update();
    }

    this.payCash = function(amount,msg) {
        this.cash -= amount;
        if(msg) {
            this.game.UI.notify(msg);
        }
        this.update();
    }

    this.canPayCash = function(amount) {
        return this.cash >= amount;
    }

    // for tests, bonuses etc
    this.freeCash = function(amount,msg) {
        this.cash += amount;
        if(msg) {
            this.game.UI.notify(msg);
        }
        this.update();
    };


    this.loan = function(amount) {
        this.bank += amount;
        this.debt += amount;
        this.update();
    };

    this.repay = function(amount) {
        this.debt -= amount;
        this.bank -= amount;
        this.update();
    }

    this.store = function(amount) {
        this.cash -= amount;
        this.bank += amount;
        this.update();
    }

    this.withdraw = function(amount) {
        this.cash += amount;
        this.bank -= amount;
        this.update();
    }

}