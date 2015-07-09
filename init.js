/**
 * This is a wrapper for the XDila game engine to bootstrap and start the game.
 * @type {{rootElement: null, game: null, _init: Function, initialize: Function, start: Function}}
 */
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

            $('.btn-replay').unbind().click(function(){
                Game.game.start(Game.rootElement);
            });

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
            this.game.addDrug('hash',       new XDila.Drug('Hash'       ,20 ,30 ,0.75, XDila.Drug.Grass));

            this.game.addDrug('acid',       new XDila.Drug('Acid'       ,20 ,30 ,0.65, XDila.Drug.Acid));
            this.game.addDrug('cpp',        new XDila.Drug('2-CP'       ,10 ,25 ,0.25, XDila.Drug.Acid));

            this.game.addDrug('speed',      new XDila.Drug('Speed'      ,30 ,45 ,0.65, XDila.Drug.Speed));
            this.game.addDrug('mephedrone', new XDila.Drug('Mephedrone' ,50 ,64 ,0.45, XDila.Drug.Speed));
            this.game.addDrug('meth',       new XDila.Drug('Meth'       ,10 ,28 ,0.25, XDila.Drug.Speed));
            this.game.addDrug('extasy',     new XDila.Drug('Extasy'     ,6  ,22 ,0.60, XDila.Drug.Extasy));


            this.game.addDrug('coke',       new XDila.Drug('Cocaine'     ,100 ,150 ,0.55, XDila.Drug.Coke));
            this.game.addDrug('heroin',     new XDila.Drug('Heroin'      ,40 ,59 ,0.55, XDila.Drug.Heroin));


            this.game.addDrug('shrooms',     new XDila.Drug('Shrooms'    ,15 ,24 ,0.7, XDila.Drug.Shrooms));


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