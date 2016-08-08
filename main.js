$(function() {

    window.valization = {};

    var Rule = function(settings) {

        var _this = this;

        _this.settings = settings;

        return this;

    }

    Rule.prototype.valizate = function(value) {

        var _this = this;

        if ( _this.settings.maxlength && !_this.maxlength(value) ) return false;

        return true;
    }

    Rule.prototype.maxlength = function(value) {

        return typeof value === 'string' && value.length < this.settings.maxlength;

    }

    var Valizator = function(selector, settings, element) {

        var _this = this;

        _this.settings = {
            selector: selector,
            element: element,
            definitions: false
        };

        $.extend(true, _this.settings, settings);

        _this.create_rules();
        _this.create_handler();

        return _this;

    }

    Valizator.prototype.create_handler = function() {

        var _this = this;

        $(document).on('keyup', _this.settings.selector, function(event) {
            _this.valizate(event.target)
        });

    }

    Valizator.prototype.create_rules = function() {

        var _this = this;

        if ( !_this.settings.definitions ) return;

        if ( !valization.rules ) valization.rules = {};

        for ( var i = 0, definitions_len = _this.settings.definitions.length; i < definitions_len; i++ ) {
            if ( rule = new Rule(_this.settings.definitions[i]) ) {
                valization.rules[_this.settings.definitions[i].name] = rule;
            }
        }

    }

    Valizator.prototype.valizate = function(target) {

        var name = target.name,
            value = target.value,
            rule = valization.rules[name],
            valid;

        if ( !valization.rules[name] ) return;

        if ( valid = rule.valizate(value) ) {
            console.log('valid');
        } else {
            console.log(('not valid'));
        }

    }

    $.fn.valizator = function(settings) {

        var _this = this,
            selector = _this.selector;

        valization[selector] = {
            timer: new Valizator(selector, settings, _this),
            selector: selector,
            settings: settings
        }

        return _this;

    }


});

$(function() {


    $('.valizator').valizator({
        definitions: [
            {
                name: 'input_1',
                required: true,
                maxlength: 5
            },
            {
                name: 'input_2',
                required: true,
                maxlength: 5
            }
        ]
    });

});