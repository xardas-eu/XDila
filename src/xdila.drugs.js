XDila.Drug.Grass = function(game,old_price,used_as){ // Happy drug
    if(Math.random()<0.33) {
        game.UI.notify('You are lucky today! the price of this awesome ' + used_as + ' was supposed to be $' + old_price + ' but now is only $5 :) also the day is ' + game.day + ' ! 420!!');
        return 5;
    }
    return old_price;
};