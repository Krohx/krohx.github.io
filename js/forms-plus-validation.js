/* global formsPlus, moment */

// Validation
if( jQuery().validate ){
    jQuery.validator.addMethod("gtoday", function(value, element, format) {
        if( typeof(moment) === 'undefined' ){
            formsPlus.log(element.name + ': please include moment.js!');
            return true;
        }
        if( typeof(format) !== 'string' ){
            formsPlus.log(element.name + ': wrong format!');
            return true;
        }
        if( !value || !format ){
            return false;
        }

        var mDate                                   = formsPlus.getMoment( value, format );
        return mDate ?
            mDate.format(format) === value && mDate.unix() >= moment( moment(Date()).format(format), format).unix()
            : false
        ;
    }, jQuery.validator.format("Please enter valid date."));
    jQuery.validator.addMethod("ltoday", function(value, element, format) {
        if( typeof(moment) === 'undefined' ){
            formsPlus.log(element.name + ': please include moment.js!');
            return true;
        }
        if( typeof(format) !== 'string' ){
            formsPlus.log(element.name + ': wrong format!');
            return true;
        }
        if( !value || !format ){
            return false;
        }

        var mDate                                   = formsPlus.getMoment( value, format );
        return mDate ?
            mDate.format(format) === value && mDate.unix() <= moment( moment(Date()).format(format), format).unix()
            : false
        ;
    }, jQuery.validator.format("Please enter valid date."));

    jQuery.validator.addMethod("captcha", function(value, element) {
        var
            $el                                     = jQuery(element),
            isValid                                 = false
        ;
        if( jQuery().realperson ){
            var rpHash                              = function(v) { 
                var h                               = 5381;
                v                                   = (v + '').toUpperCase();
                for(var i = 0; i < v.length; i++) { 
                    h = ((h << 5) + h) + v.charCodeAt(i); 
                } 
                return h;
            };
            if( rpHash( value ) === $el.realperson('getHash') ){
                isValid                             = true; 
            }
        }else if( value ){
            isValid                                 = true;
        }
        
        return isValid;
    }, jQuery.validator.format("Please enter correct code."));

    jQuery.validator.addMethod("grouprequire", function(value, element, opts) {
        var
            $el                                     = jQuery(element),
            $fields                                 = false,
            options                                 = $el.data('grouprequireOptions')
        ;
        if( !options ){
            if( typeof(opts) === 'string' ){
                options                             = opts.split(':');
                options                             = {
                    selector                        : '[data-rule-grouprequire="' + options[0] + '"], [data-rule-grouprequire^="' + options[0] + ':"]',
                    min                             : options.length > 1 && options[1] ? options[1] : 1,
                    max                             : options.length > 2 && options[2] ? options[2] : 0,
                };
            }
            $fields                                 = jQuery( options.selector, element.form ).data('grouprequireOptions', options);
        }else{
            $fields                                 = jQuery( options.selector, element.form );
        }
        var
            $fieldsFirst                            = $fields.eq(0),
            validator                               = ($fieldsFirst.data("validSkip") ? $fieldsFirst : $fieldsFirst.data("validSkip", jQuery.extend({}, this))).data("validSkip"),
            count                                   = $fields.filter(function() {
                var val,
                    $element                        = jQuery( this ),
                    type                            = this.type;

                if ( type === "radio" || type === "checkbox" ) {
                    return $element.filter(":checked").val();
                } else if ( type === "number" && typeof this.validity !== "undefined" ) {
                    return this.validity.badInput ? false : $element.val();
                }

                val = $element.val();
                if ( typeof val === "string" ) {
                    return val.replace(/\r/g, "" );
                }
                return val;
            }).length,
            isValid                                 = true
        ;

        if( count < options.min || (options.max && count > options.max) ){
            isValid                                 = false;
        }
        $fieldsFirst = count                        = null;

        // If element isn't being validated, run each grouprequire field's validation rules
        if (!$el.data("beingValidated")) {
            if( validator.checkable(element) ){
                $fields                             = $fields.not( '[name="' + $el.attr('name') + '"]' );
            }
            $fields.data("beingValidated", true);
            $fields.each(function() {
                validator.element(this);
            });
            $fields.data("beingValidated", false);
        }
        
        return isValid;
    }, jQuery.validator.format("Please fill some of these fields."));

    jQuery.fn.fpValidate                            = function(){
        if( !formsPlus.pluginCheck(this, "Forms Plus: validate - Nothing selected.") ){
            return this;
        }
        var createStateMsg                          = function(){
            return jQuery('<span>').addClass('p-field-sub-text p-validation-state');
        };
        jQuery.each(this, function(i, $form){
            $form                                   = jQuery($form);
            $form.validate({
                errorClass                          : 'p-field-error',
                validClass                          : 'p-field-valid',
                errorElement                        : 'span',
                ignore                              : '.p-ignore-field',
                highlight                           : function(element, errorClass, validClass) {
                    jQuery(element).closest(formsPlus.selectors.validationWrap).removeClass(validClass).addClass(errorClass);
                },
                unhighlight                         : function(element, errorClass, validClass) {
                    var
                        $element                    = jQuery(element),
                        $wrap                       = $element.closest(formsPlus.selectors.validationWrap).removeClass(errorClass).addClass(validClass),
                        $subtext                    = $wrap.find('.p-validation-state') || false,
                        $icon                       = $element.data('validIcon') ? jQuery($element.data('validIcon')) : false //Create icon for message
                    ;
                    if( $element.data('$fpValidationMsg') ){
                        //Remove old message;
                        $element.data('$fpValidationMsg').remove();
                        $element.data('$fpValidationMsg', null);
                    }

                    //check if valid message should be shown
                    if( $element.data('validMsg') && ($form.data('showValidMsg') || $element.data('showValidMsg')) ){
                        $subtext                    = $subtext ? $subtext : createStateMsg().appendTo($wrap);
                        if( $form.data('jsShowStateIcons') ){
                            $icon                   = ( $icon ? $icon : jQuery( $form.data('validIcon') || '<i class="fa fa-check"></i>' ) ).appendTo($subtext);
                        }
                        //if form or element has '<any data-highlight-state-msg="true" >' then highlight all message, if not highlight just icon if any
                        if( $form.data('jsHighlightStateMsg') || $element.data('jsHighlightStateMsg') ){
                            $subtext.addClass('p-valid-text');
                        }else if( $icon ){
                            $icon.addClass('p-valid-text');
                        }
                        $element.data('$fpValidationMsg', $subtext);
                    }else if( !$subtext.html() ){
                        //If no errors - remove
                        $subtext.remove();
                    }
                },
                errorPlacement                      : function(error, element) {
                    var
                        $element                    = jQuery(element),
                        $error                      = jQuery(error),
                        $wrap                       = $element.closest(formsPlus.selectors.validationWrap),
                        $subtext                    = ( $wrap.find('.p-validation-state').length ? $wrap.find('.p-validation-state')
                            : createStateMsg().appendTo($wrap) ),
                        $icon                       = $element.data('errorIcon') ? jQuery($element.data('errorIcon')).appendTo($subtext) : false //Create icon for message
                    ;
                    if( $element.data('$fpValidationMsg') ){
                        //Remove old message;
                        $element.data('$fpValidationMsg').remove();
                    }
                    $element.data('$fpValidationMsg', $error);
                    if( !$icon && $form.data('jsShowStateIcons') ){
                        $icon                       = jQuery( $form.data('errorIcon') || '<i class="fa fa-times"></i>' ).appendTo($subtext);
                    }
                    $subtext.append( $error );

                    //if form or element has '<any data-highlight-state-msg="true" >' then highlight all message, if not highlight just icon if any
                    if( $form.data('jsHighlightStateMsg') || $element.data('jsHighlightStateMsg') ){
                        $subtext.addClass('p-error-text');
                    }else if( $icon ){
                        $icon.addClass('p-error-text');
                    }
                },
                submitHandler                       : function(form){
                    var $form                       = jQuery(form);
                    $form.off('fpGeneralCheck.fpValidate');
                    if( jQuery().fpAjaxSubmit && $form.is('[data-js-ajax-form]') ){
                        $form.fpAjaxSubmit();
                        var jqXHR                   = $form.data('jqxhr');
                        if( !jqXHR ){
                            $form.on('fpGeneralCheck.fpValidate', function(e, dfds){
                                dfds.push(jQuery.Deferred().resolve('validation'));
                            });
                        }
                    }else{
                        form.submit();
                    }
                },
                invalidHandler                      : function(){
                    $form
                        .off('fpGeneralCheck.fpValidate')
                        .on('fpGeneralCheck.fpValidate', function(e, dfds){
                            dfds.push(jQuery.Deferred().reject('validation'));
                        })
                    ;
                }
            });
        });
        return this;
    };
    // Add init function
    formsPlus.initFn.push(function($container){
        //Check if it's already being validated
        if( !$container.closest('form[data-js-validate]').length ){
            $container.find('form[data-js-validate]').fpValidate();
        }

        /*
            Trigger 'fpGeneralCheck' event for these element to run check for it's fields.
            This functionality is used for example for steps(forms-plus-steps.js) to validate current step.
        */
        $container.find('[data-js-validation-block]')
            .off('.fpValidate')
            .on('fpGeneralCheck.fpValidate', function(e, dfds){
                var
                    dfd                             = jQuery.Deferred(),
                    valid                           = true
                ;
                dfds.push(dfd);

                //Run check for all default fields
                jQuery(this).find(":text, [type='password'], [type='file'], select, textarea, [type='number'], [type='search'], " +
                    "[type='tel'], [type='url'], [type='email'], [type='datetime'], [type='date'], [type='month'], " +
                    "[type='week'], [type='time'], [type='datetime-local'], [type='range'], [type='color'], " +
                    "[type='radio'], [type='checkbox']").each(function(i, $el){
                    if( !jQuery($el).valid() ){
                        valid                       = false;
                    }
                });
                if( valid ){
                    dfd.resolve('validation');
                }else{
                    dfd.reject('validation');
                }
            })
        ;
    });
}