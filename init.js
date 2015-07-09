var Game = {
    rootElement: null,
    game: null,

    _init: function(playerName,gameTime) {

        this.game.days_limit = gameTime;
        var player = new XDila.Player(playerName,this.game);
        this.game.setPlayer(player);

        if(typeof(XDila.Events)!=='undefined') {
            var events = new XDila.Events(this.game);
            events.register();
        } else {}

        try {
            this.game.start(this.rootElement);
            player.Bank.freeCash(200);
            player.Bank.studentLoan(150);
        } catch (e if e instanceof TypeError) {
            bootbox.alert('Sorry but the game failed embarassingly :( Please refresh the page. Geek details below.<br/><strong>'+e+'</strong><pre>'+ e.stack+'</pre>');
            $('.board').hide();
        } catch(e) {
            bootbox.alert('EXCEPTION happened :( Please refresh the page. Geek details below.<br/><strong>'+e+'</strong><pre>'+ e.stack+'</pre>');
        }
    },

    initialize: function() {
        try {
            var game = new XDila();
            this.game = game;


            this.game.addDrug('grass',      new XDila.Drug('Grass'      ,20 ,28 ,0.85, XDila.Drug.Grass));
            this.game.addDrug('hash',       new XDila.Drug('Hash'       ,20 ,28 ,0.85, XDila.Drug.Grass));

            this.game.addCity('krakow', new XDila.City('Kraków'));
            this.game.addCity('warszwaa', new XDila.City('Warszawa'));
            this.game.addCity('lodz', new XDila.City('Łódź'));
            this.game.addCity('wroclaw', new XDila.City('Wrocław'));
            this.game.addCity('poznan', new XDila.City('Poznań'));
            this.game.addCity('gdansk', new XDila.City('Gdańsk'));
        } catch(e) {
            bootbox.alert('Sorry but the game would not initialize properly :( Please refresh the page. Geek details below.<br/><strong>'+e+'</strong><pre>'+ e.stack+'</pre>');
        }


    },

    start: function(rootElement,gameTime) {
        this.rootElement = rootElement;
        var self = this;
        var playerName = '';
        bootbox.prompt('Hello young dealer, what is you name?',function(name) {
            if(name) {
                bootbox.alert('Okay <strong>'+name+'</strong>, it all starts now..'+gameTime.find('option:selected').text()+' is a long of time here..');
                setTimeout(function() {
                    $('#start').hide();
                    self._init(name, gameTime.val());
                },100);
                return true;
            } else {
                bootbox.alert('We can\'t play like this. Sorry bro. I need a name, hustler.');
            }
        });









    }
}