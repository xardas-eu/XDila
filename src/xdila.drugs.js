XDila.Drug.Grass = function(game,old_price,used_as){ 
    if(Math.random()<0.23) { return Math.ceil(old_price*0.75);}
    if(Math.random()<0.15) { return Math.ceil(old_price*1.5);}

    return old_price;
};

XDila.Drug.Speed = function(game,old_price,used_as){ 
    if(Math.random()<0.1) { return Math.ceil(old_price*0.55);}
    if(Math.random()<0.09) { return Math.ceil(old_price*4.0);}

    return old_price;
};

XDila.Drug.Acid = function(game,old_price,used_as){ 
    if(Math.random()<0.12) { return Math.ceil(old_price*0.55);}
    if(Math.random()<0.15) { return Math.ceil(old_price*1.8);}

    return old_price;
};

XDila.Drug.Extasy = function(game,old_price,used_as){ 
    if(Math.random()<0.15) { return Math.ceil(old_price*0.55);}
    if(Math.random()<0.1) { return Math.ceil(old_price*3.0);}

    return old_price;
};

XDila.Drug.Shrooms = function(game,old_price,used_as){ 
    if(Math.random()<0.15) { return Math.ceil(old_price*0.50);}
    if(Math.random()<0.15) { return Math.ceil(old_price*2.5);}

    return old_price;
};

XDila.Drug.Heroin = function(game,old_price,used_as){
    return old_price;
};

XDila.Drug.Coke = function(game,old_price,used_as){ 
    if(Math.random()<0.15) { return Math.ceil(old_price*0.3);}
    if(Math.random()<0.2) { return Math.ceil(old_price*2.0);}

    return old_price;
};