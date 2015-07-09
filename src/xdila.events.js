$(document).ready(function(){
    XDila.Events = function(game) {

        this._transportCost = 2;
        this._transportRespectCost = -3;



        this.game = game;
        this.register = function() {
            var self = this;
            var dispatcher = this.game.dispatcher;
            var UI         = this.game.UI;
            var player     = this.game.Player;

            // MAIN CITY MOVER
            dispatcher.register('game.new-day.after', function(event) {
                UI.notify('Yet another day has passed. Now at <strong>Day '+event.args.current_day+'</strong>.. beautiful day in <strong>'+event.args.current_city.name+'</strong>!');

                var city = event.args.current_city;

                // render the city drug table
                var element = UI.ui_elements['city-'+city.internal_name];
                element.html('wait..');
                // and select it, but that's UI job
                UI.selectCityTab(event.args.current_city);
                var table = self.game.createCityDrugTable();
                UI.renderCityDrugTab(event.args.current_city,table);
            });



            // PAYING FOR TRANSPORT
            dispatcher.register('game.new-day.after', function(event) {
                if(self.game.day==1) {
                    return true;
                }
                if(!player.Bank.canPayCash(self._transportCost)) {
                    player.addOrTakeRespect(self._transportRespectCost);
                    UI.notify('You REALLY couldn\'t afford the bus, huh?','error'); // @TODO check if has car
                    return true;
                }

                player.Bank.payCash(self._transportCost);
            });

        }
    }
    return true;
});