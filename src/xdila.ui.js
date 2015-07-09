
XDila.UI = function () {

    this.ui_elements = {};

    this.root = null;
    this.game = null;

    this.notificationElement = $('<div class="alert xdila-alert"></div>');

    this.notify = function (msg, type) {
        if (!type) {
            type = 'success';
        }


        // @TODO dodac **cos** itd ..!!!
        var ticker = this.root.find('.notification-ticker');
        var element = this.notificationElement.clone();
        element.addClass('alert-' + type).html(msg);
        ticker.prepend(element);
        element.slideDown();
    };

    this._refreshElements = function () {
        var self = this;
        this.root.find('[data-ui-element]').each(function () {
            var element = $(this);
            self.ui_elements[element.attr('data-ui-element')] = element;
        });


    };

    this.nextDay = function () {
        // @TODO eventize
        this.update();
    }

    this._updateHUD = function () {
        this.ui_elements['player-name'].html(this.game.Player.name);
        this.ui_elements['current-day'].html(this.game.day);
        this.ui_elements['game-duration'].html(this.game.days_limit);
        this.ui_elements['player-cash'].html(this.game.Player.Bank.cash);
        this.ui_elements['player-debt'].html(this.game.Player.Bank.debt);
        this.ui_elements['player-bank'].html(this.game.Player.Bank.bank);
        this.ui_elements['player-respect'].html(this.game.Player.respect);
    };

    this._renderCities = function () {
        var tabs = this.root.find('.cities-tabs');
        var content = this.root.find('.cities-content .tab-content');
        for (cityName in this.game.cities) {
            var cityObj = this.game.cities[cityName];
            var first = !content.html();

            var tab = $('<li><a data-toggle="tab"></a>');

            tab.attr('id','city-tab-'+cityName);
            tab.find('a').data('city-name',cityObj.internal_name).attr('href', '#city-' + cityName).html(cityObj.name).click(function(){
                Game.game.goToCity(Game.game.cities[$(this).data('city-name')]);
            });
            tabs.append(tab);


            var contentValue = '[Rendering]';
            var contentElement = $('<div class="tab-pane"><div class="page-header"><h2></h2><div>&nbsp;</div></div></div>');
            contentElement.find('div:last').html(contentValue).attr('data-ui-element', 'city-' + cityName);
            contentElement.find('h2').html(cityObj.name);
            contentElement.attr('id', 'city-' + cityName);
            content.append(contentElement);
        }
        this._refreshElements();
    };

    this._renderDrugTab = function () {
        var grid = this.ui_elements['drug-grid'];
        var tab = this.ui_elements['tab-drugs'];
        grid.bootgrid({
            templates: {
                footer: "",
                header: "<div id=\"{{ctx.id}}\" class=\"{{css.header}}\">       </div>"
            }
        });

        $.contextMenu({
            selector: 'table.own-drugs tr',
            callback: function (key, options) {
                var m = "clicked: " + key;
                window.console && console.log(m) || alert(m);
            },
            items: {
                "sell": {name: "Sell", icon: "edit"},
                "drop": {name: "Drop", icon: "cut"}
            }
        });

    };

    this.selectCityTab = function (city) {
        var name = city.internal_name;
        var tabs = this.ui_elements['cities-tabs'];
        var contents = this.ui_elements['cities-content'];
        tabs.find('li').removeClass('active');
        contents.find('.tab-pane').removeClass('active');
        tabs.find('#city-tab-'+name).addClass('active');
        contents.find('#city-'+name).addClass('active');
    };


    this._renderTableGrid = function(data, headers, ui_element) {
        var table           = $('<table class="table table-condensed table-hover table-striped drugs-table"><thead><tr></tr></thead><tbody></tbody></table>');
        var header_row      = table.find('thead tr');
        var table_body      = table.find('tbody');

        table.attr('data-ui-element',table);

        $.each(headers,function(field_name,label){
            var header = $('<th></th>');
            if(field_name!='name') {
                header.attr('data-type','numeric');
            }
            header.html(label);
            header_row.append(header);
        });

        $.each(data,function(id,row){
           var table_row = $('<tr></tr>');
           $.each(headers,function(field_name,label){
              table_row.append('<td data-column-id="'+field_name+'">'+row[field_name]+'</td>');
           });
            table_body.append(table_row);
        });
        return table;
    }


    this.renderOwnDrugTab = function(data) {
        var element = this.ui_elements['tab-drugs'].find('div');
        var headers = {name:'Name',amount:'Amount',price:'Price'};
        var table = this._renderTableGrid(data,headers,'own-drug-table');
        element.html(table);
        this._refreshElements();
    };

    this.renderCityDrugTab = function(city,data) {
        var element = this.ui_elements['city-'+city.internal_name];
        var headers = {name:'Name',price:'Price'};

        var table = this._renderTableGrid(data,headers,'drug-table-'+city.internal_name);
        element.html(table);
        this._refreshElements();
    };

    this.update = function() {
        this._refreshElements();
        this._updateHUD();
    }

    this.start = function (root, game) {
        this.root = root;
        this.game = game;
        root.find('.board').show();
        this._refreshElements();
        this._renderCities();
        this.update();
    }
}