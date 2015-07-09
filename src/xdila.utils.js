$(document).ready(function(){
   XDila.Utils = function() {

   };


    // data: array([price:amount)
    XDila.Utils.calculateAverageDrugPrice = function (old_amount, old_price, new_amount, new_price) {
        var data = {};

        data[old_price]=old_amount;
        data[new_price]=new_amount;

        var total = 0, count = 0;
        for(var amount in data) {
            total += parseInt(amount)*parseInt(data[amount]);
            count += parseInt(data[amount]);
        }
        return Math.floor(total/count);
    }
});