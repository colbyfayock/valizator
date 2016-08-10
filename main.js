$(function() {

    window.valization = {};
    valization.instances = {};

    window.Valizator = function(selector, settings, element) {

        var _this = this;

        _this.selector = selector;
        _this.rules = false;
        
        if ( element ) _this.target = element;

        _this.create_rules(settings);
        _this.create_handler();

        return _this;

    }

    Valizator.prototype.create_handler = function() {

        var _this = this;

        $(document).on('submit keyup change valizate initialize.valizator', _this.selector, function(event, settings) {

            if ( typeof settings === 'undefined' ) settings = false;

            var $that = $(this),
                $form = $that.is('form') ? $that : $that.closest('form'),
                valid = false,
                $target,
                $invalid;

            if ( this.tagName.toLowerCase() === 'form' ) {
                $target = $that.find(':input:not([type="submit"])');
            } else {
                $target = $that;
            }


            if ( event.type === 'submit' || event.type === 'valizate' || event.type === 'initialize' ) {
                $form.addClass('is-valization-active');
            }

            
            if ( event.type === 'submit' || event.type === 'valizate' ) {

                if ( $target.length > 0 ) {
                    valid = _this.valizate($target);
                }

            }


            if ( event.type === 'change' || event.type === 'keyup' ) {
                
                if ( !$form.hasClass('is-valization-active') ) return;
                
                valid = _this.valizate($target);

            }

            if ( event.type === 'initialize' ) {

                if ( typeof settings.is_valid !== 'undefined' ) {
                    valid = settings.is_valid;
                } else {
                    return;
                }

            }

            if ( valid ) {
                $form.removeClass('not-valid').addClass('is-valid');
            } else {
                $form.removeClass('is-valid').addClass('not-valid');
            }

            if ( !valid ) return false   

        });

    }

    Valizator.prototype.create_rules = function(settings) {

        var _this = this;

        if ( typeof settings === 'undefined' ) return;
        if ( !settings.definitions ) return;
        if ( !_this.rules ) _this.rules = {};

        for ( var i = 0, definitions_len = settings.definitions.length; i < definitions_len; i++ ) {
            if ( rule = new Rule(settings.definitions[i]) ) {
                _this.rules[settings.definitions[i].name] = rule;
            }
        }

    }

    Valizator.prototype.valizate = function(target) {

        var _this = this,
            valid = true,
            $target,
            $form,
            name,
            value,
            rule;

        if ( typeof target === 'undefined' ) {
            target = $(_this.selector).find(':input:not([type="submit"])');
        }

        if ( typeof target === 'object' && target instanceof $ ) {

            $form = target.is('form') ? target : target.closest('form')
            
            target.each(function() {
                if ( this.type === 'submit' ) return;
                if ( !_this.valizate(this) ) valid = false;
            });

            if ( !$form.hasClass('is-valization-active') ) {
                $form.trigger('initialize.valizator', [{
                    is_valid: valid
                }]);
            }

            return valid;

        }

        $target = $(target);
        $form = $target.is('form') ? $target : $target.closest('form');
        instance = $form.attr('data-valizator-id');
        name = target.name;
        value = target.value;
        rule = _this.rules[name];

        if ( !rule ) return true;

        valid = rule.valizate(value);

        if ( valid ) {
            $target.removeClass('not-valid').addClass('is-valid');
        } else {
            $target.removeClass('is-valid').addClass('not-valid');
        }

        return valid;

    }


    var Rule = function(settings) {

        var _this = this;

        $.extend(true, _this, settings);

        return _this;

    }

    Rule.prototype.valizate = function(value) {

        var _this = this;

        if ( _this.required && ( !_this.minlength || _this.minlength < 1 ) ) _this.minlength = 1;

        if ( _this.minlength && !_this.is_minlength(value) ) return false;
        if ( _this.maxlength && !_this.is_maxlength(value) ) return false;

        return true;
    }

    Rule.prototype.is_minlength = function(value) {

        return typeof value === 'string' && value.length > this.minlength;

    }

    Rule.prototype.is_maxlength = function(value) {

        return typeof value === 'string' && value.length < this.maxlength;

    }


    $.fn.valizator = function(settings) {

        var _this = this,
            selector = _this.selector;

        valization.instances[selector] = new Valizator(selector, settings, _this);

        return _this;

    }


    $.fn.valizate = function() {

        var _this = this,
            selector = _this.selector,
            valization_id;

        if ( $(_this).attr('data-valizator-id') ) {
            valization_id = '[data-valizator-id="' + $(_this).attr('data-valizator-id') + '"]';
        } else {
            valization_id = selector;
        }

        return valization.instances[valization_id] ? valization.instances[valization_id].valizate() : true;

    }


});