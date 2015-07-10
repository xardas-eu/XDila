XDila.UI = function () {

    this.ui_elements = {};

    this.root = null;
    this.game = null;

    this.notificationElement = $('<div class="alert xdila-alert"></div>');

    this.notify = function (msg, type) {
        if (!type) {
            type = 'success';
        }

        if (type == 'error') {
            type = 'danger';
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

        this.ui_elements['player-health'].html(this.game.Player.health + '%');
        this.ui_elements['player-health-bar'].css('width', this.game.Player.health + '%');

        this.ui_elements['drugs-capacity-left'].html(this.game.Player.getRemainingCapacity());
        this.ui_elements['drugs-capacity-total'].html(this.game.Player.capacity);
    };

    this._renderCities = function () {
        var tabs = this.root.find('.cities-tabs');
        var content = this.root.find('.cities-content .tab-content');
        tabs.html('');
        content.html();
        for (cityName in this.game.cities) {
            var cityObj = this.game.cities[cityName];
            var first = !content.html();

            var tab = $('<li><a data-toggle="tab"></a>');

            tab.attr('id', 'city-tab-' + cityName);
            tab.find('a').data('city-name', cityObj.internal_name).attr('href', '#city-' + cityName).html(cityObj.name).click(function () {


                // @TODO think about this
                //Game.game.UI.ui_elements['tab-drugs-link'].click();

                Game.game.goToCity(Game.game.cities[$(this).data('city-name')]);
            });
            tabs.append(tab);


            var contentValue = '[Rendering]';
            var contentElement = $('<div class="tab-pane"><div class="page-header"><div>&nbsp;</div></div></div>');
            contentElement.find('div:last').html(contentValue).attr('data-ui-element', 'city-' + cityName);
            contentElement.attr('id', 'city-' + cityName);
            content.append(contentElement);
        }
        this._refreshElements();
    };

    this.selectCityTab = function (city) {
        var name = city.internal_name;
        var tabs = this.ui_elements['cities-tabs'];
        var contents = this.ui_elements['cities-content'];
        tabs.find('li').removeClass('active');
        contents.find('.tab-pane').removeClass('active');
        tabs.find('#city-tab-' + name).addClass('active');
        contents.find('#city-' + name).addClass('active');
    };


    this._renderTableGrid = function (data, headers, ui_element) {
        var table = $('<table class="table table-condensed table-hover table-striped drugs-table"><thead><tr></tr></thead><tbody></tbody></table>');
        var header_row = table.find('thead tr');
        var table_body = table.find('tbody');

        table.attr('data-ui-element', ui_element);

        $.each(headers, function (field_name, label) {
            var header = $('<th></th>');
            if (field_name != 'name') {
                header.attr('data-type', 'numeric');
            }
            header.html(label);
            header_row.append(header);
        });

        $.each(data, function (id, row) {
            var table_row = $('<tr></tr>');
            table_row.addClass('drug-table-row');
            table_row.attr('data-drug-name',id);
            $.each(headers, function (field_name, label) {
                table_row.append('<td data-column-id="' + field_name + '">' + row[field_name] + '</td>');
            });
            table_body.append(table_row);
        });
        return table;
    }

    this.setInputError = function (field, error, message) {
    };


    this.bankFlash = function (type) {
        if (type) {
            $('.' + type + '-stat').effect("highlight", {}, 500);
        } else {
            $('.cash-stat').effect("highlight", {}, 500);
            $('.debt-stat').effect("highlight", {}, 500);

        }
    }

    this.bankUpdate = function () {
        var bank = this.game.Player.Bank;
        var self = this;

        var deposit_element = this.ui_elements['bank-deposit'];
        var withdraw_element = this.ui_elements['bank-withdraw'];
        var repay_element = this.ui_elements['bank-repay'];
        var loan_element = this.ui_elements['bank-loan'];


        var amountTransferer = function (bank, field) {
            return function () {
                var val = parseInt($(this).closest('div').find('input').val());
                switch (field) {
                    case 'deposit':
                        bank.store(val);
                        break;
                    case 'repay':
                        bank.repay(val);
                        break;
                    case 'withdraw':
                        bank.withdraw(val);
                        break;
                    case 'loan':
                        bank.loan(val);
                        break;
                }
            }
        };

        var amountValidator = function (bank, field) {
            return function () {
                var parent = $(this).parent();
                var pay = $(this).val();
                var own = 0;
                switch (field) {
                    case 'deposit':
                    case 'repay':
                        own = bank.cash;
                        break;
                    case 'withdraw':
                        own = bank.bank;
                        break;
                    case 'loan':
                        own = bank.cash * 2;
                        break;
                }

                if (pay <= own) {
                    $(this).removeClass('has-error');
                    parent.find('button').prop('disabled', false);
                    return true;
                }

                $(this).addClass('has-error');
                parent.find('button').prop('disabled', true);
                return false;
            }
        };


        var element_collection = [deposit_element, withdraw_element, repay_element, loan_element];
        $.each(element_collection, function (k, element) {
            var input = element.find('input');
            input.unbind().change(amountValidator(bank, input.attr('data-field')));
            input.keyup(function () {
                $(this).trigger('change')
            });
            element.find('button').prop('disabled', true).unbind().click(amountTransferer(bank, input.attr('data-field')));
            input.trigger('change');
            element.hide();
        });

        if (bank.cash) {
            deposit_element.show();
        }

        if (bank.bank) {
            withdraw_element.show();
        }

        if (bank.debt) {
            repay_element.show();
        } else {
            loan_element.show();
        }


    };

    this.niceTable = function (grid, commands, selected_row_class) {
        var self = this;
        var selector = grid.attr('data-ui-element');
        if (commands) {
            // @TODO RIFHTCLICK SUPPPRT!!!
            $.contextMenu({
                selector: 'table[data-ui-element="' + selector + '"] tr',
                callback: function (operation, options) {
                    var row = options.$trigger;
                    row.click();
                    var drug = null;
                    if(row.hasClass('own-drug-selected')) {
                        var drug = self.getSelectedOwnDrug();
                    } else {
                        var drug = self.getSelectedCityDrug();
                    }
                    self[operation+'Drugs'](drug);
                },
                items: commands
            });
        }


        grid.find('tr').unbind().click(function () {
            var row = $(this);
            if(!row.hasClass('drug-table-row')) {
                return true;
            }
            row.parent().find('tr').removeClass('drug-row-active').removeClass(selected_row_class);
            row.addClass('drug-row-active').addClass(selected_row_class);
            self._refreshButtons();
        });
        return grid;
    };



    this.getSelectedOwnDrug = function() {
        var selected_own_drug  = this.root.find('.own-drug-selected');
        if(selected_own_drug.length) {
            var drug = this.game.Player.drugs[selected_own_drug.attr('data-drug-name')];
            return drug;
        }
        return null;
    };

    this.getSelectedCityDrug = function(){
        var selected_city_drug = this.root.find('.city-drug-selected');
        if(selected_city_drug.length) {
            var drug = this.game.drugs[selected_city_drug.attr('data-drug-name')];
            return drug;
        }
        return null;
    };

    this.getDrugsAmountValidator = function(max_amount) {
        var self = this;
        return function() {
            var el  = $(this);
            var val = parseInt(el.val());
            if(val>max_amount) {
                el.addClass('has-error');
                el.closest('.modal-content').find('.btn-primary').prop('disabled',true);
            } else {
                el.removeClass('has-error');
                el.closest('.modal-content').find('.btn-primary').prop('disabled',false);
            }
        }
    };

    this.buyDrugs = function(drug) {
        var self = this;
        // refresh the drug!
        var drug = this.game.drugs[drug.internal_name];
        var message = 'You want to buy %drug% for $%price%/gram. You can afford <strong>%afford-grams%</strong> grams, and you can store <strong>%free-storage%</strong> grams. How many do you want?';
        var cash = this.game.Player.Bank.cash;
        var afford_grams = Math.floor(cash/drug.price);
        var free_storage = this.game.Player.getRemainingCapacity();

        var max_amount = afford_grams;
        if(free_storage<max_amount) {
            max_amount = free_storage;
        }

        message = message.replace('%drug%',drug.name)
                         .replace('%price%',drug.price)
                         .replace('%afford-grams%',afford_grams)
                         .replace('%free-storage%',free_storage);

        bootbox.prompt(message, function(amount){
            amount = parseInt(amount);
            if(!amount) {
                return true;
            }

            self.game.Player.buyDrugs(drug,amount,drug.price);
            return true;
        });

        $('.bootbox-prompt input.bootbox-input')
            .change(this.getDrugsAmountValidator(max_amount))
            .keyup(function(){$(this).trigger('change')})
            .blur(function(){ $(this).trigger('change')})
            .val(max_amount);
    };

    this.sellDrugs = function(drug){
        var self = this;
        var message = 'You want to sell %drug% at $%price%/gram. You have <strong>%have-grams%</strong> grams. How many do you want to sell?';
        var player_drug = self.game.Player.drugs[drug.internal_name];
        var max_amount = player_drug.amount;

        drug.price = this.game.drugs[player_drug.internal_name].price;
        message = message.replace('%drug%',drug.name)
            .replace('%price%',drug.price)
            .replace('%have-grams%',max_amount);

        bootbox.prompt(message, function(amount){
            amount = parseInt(amount);
            if(!amount) {
                return true;
            }
            self.game.Player.sellDrugs(drug,amount,drug.price);
            return true;
        });

        $('.bootbox-prompt input.bootbox-input')
            .change(this.getDrugsAmountValidator(max_amount))
            .keyup(function(){$(this).trigger('change')})
            .blur(function(){ $(this).trigger('change')})
            .val(max_amount);
    };

    this.dropDrugs = function(drug) {
        var self = this;
        var message = 'You want to drop %drug%. This operation cannot be reversed. You have <strong>%have-grams%</strong> grams. How many do you want to drop?';
        var player_drug = self.game.Player.drugs[drug.internal_name];
        var max_amount = player_drug.amount;

        message = message.replace('%drug%',drug.name)
            .replace('%have-grams%',max_amount);

        bootbox.prompt(message, function(amount){
            amount = parseInt(amount);
            if(!amount) {
                return true;
            }
            self.game.Player.dropDrugs(drug,amount);
            return true;
        });

        $('.bootbox-prompt input.bootbox-input')
            .change(this.getDrugsAmountValidator(max_amount))
            .keyup(function(){$(this).trigger('change')})
            .blur(function(){ $(this).trigger('change')})
            .val(max_amount);
    };


    this._buttons = ['buy-button', 'sell-button', 'drop-button'];

    this._refreshButtons = function() {
        var self = this;
        $.each(this._buttons, function (k, buttonClass) {
            self.ui_elements[buttonClass].prop('disabled', true).unbind().click(function() {
                var button = $(this);
                var button_class = button.attr('data-ui-element');
                switch(button_class) {
                    case 'buy-button':
                        self.buyDrugs(self.getSelectedCityDrug());
                        break;
                    case 'sell-button':
                        self.sellDrugs(self.getSelectedOwnDrug());
                        break;
                    case 'drop-button':
                        self.dropDrugs(self.getSelectedOwnDrug());
                        break;
                }
            });
        });



        // buy first
        if(this.getSelectedCityDrug()){
            this.ui_elements['buy-button'].prop('disabled',false);
        }

        // sell next
        if(this.getSelectedOwnDrug()){
            this.ui_elements['sell-button'].prop('disabled',false);
            this.ui_elements['drop-button'].prop('disabled',false);
        }

    };

    this.renderOwnDrugTab = function (data) {
        var element = this.ui_elements['tab-drugs'].find('div');
        var headers = {name: 'Name', amount: 'Amount', price: 'Price'};
        var table = this._renderTableGrid(data, headers, 'own-drug-table');
        element.html(table);
        table.find('tr').unbind();
        this.niceTable(table, {
            "sell": {name: "Sell", icon: "edit"},
            "drop": {name: "Drop", icon: "cut"}
        },'own-drug-selected');
        this._refreshElements();
    };

    this.renderCityDrugTab = function (city, data) {
        var element = this.ui_elements['city-' + city.internal_name];
        var headers = {name: 'Name', price: 'Price'};

        var table = this._renderTableGrid(data, headers, 'drug-table-' + city.internal_name);

        element.empty().append(table);
        this.niceTable(table, {
            "buy": {name: "Buy", icon: "edit"}
        },'city-drug-selected');
        this.update();
        this._refreshElements();
    };


    this.update = function () {
        var self = this;
        this._refreshElements();
        this._updateHUD();
        this._refreshButtons();
    }

    this.start = function (root, game) {
        this.root = root;
        this.game = game;
        root.find('.notification-ticker').html('');
        root.find('.board').show();
        this._refreshElements();
        this._renderCities();
        this.update();
    }
}