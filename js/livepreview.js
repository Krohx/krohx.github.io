jQuery(function(){
    if( !jQuery('#form-options').length ){
        return;
    }
    var
        $form                   = jQuery('#p-form-skin'),
        $panel                  = jQuery('#preview-btn-pan'),
        $container              = $form.find('.p-form').not('.preview-part'),
        $optionsForm            = jQuery('#form-options'),
        $skin                   = $optionsForm.find('[name="skin"]'),
        $style                  = $optionsForm.find('[name="style[]"]'),
        $size                   = $optionsForm.find('[name="size"]'),
        $tabsOut                = $optionsForm.find('[name="tabsOut"]'),
        $stepsOut               = $optionsForm.find('[name="stepsOut"]'),
        $colors                 = $optionsForm.find('[name="colorpick"]'),
        $backgrounds            = $optionsForm.find('[name="bgpick"]'),
        $buttonBlock            = $optionsForm.find('[name="btnBlock"]'),
        $validation             = $optionsForm.find('[name="validation"]'),
        $validationHighlight    = $optionsForm.find('[name="validationHighlight"]'),
        $tStyle         = {
            'title'         : $optionsForm.find('[name="titleStyle"]'),
            'subtitle'      : $optionsForm.find('[name="subtitleStyle"]'),
        },
        $tPosition      = {
            'title'         : $optionsForm.find('[name="titlePosition"]'),
            'subtitle'      : $optionsForm.find('[name="subtitlePosition"]'),
            'buttons'       : $optionsForm.find('[name="buttonsPosition"]')
        },

        oStyles         = {
            'shadow'        : 'p-shadowed',
            'border'        : 'p-bordered',
            'inset'         : 'p-inset',
            'altBack'       : 'p-alt-back'
        },

        oSize           = {
            'tiny'          : 'p-form-tiny',
            'xs'            : 'p-form-xs',
            'sm'            : 'p-form-sm',
            'md'            : 'p-form-md',
            'lg'            : 'p-form-lg'
        },

        tStyles         = {
            'side'          : 'p-title-side',
            'line'          : 'p-title-line',
            'stepline'      : 'p-title-step-line'
        },
        tPosition       = {
            'center'        : 'text-center',
            'left'          : 'text-left',
            'right'         : 'text-right',
        },

        pChangeColor        = function(){
            var
                css             = [],
                $sel            = $colors.filter(':checked').first(),
                allowedColors   = $skin.find(':selected').data('colors').split(' ')
            ;
            if( jQuery.inArray($sel.val(), allowedColors) < 0 ){
                $colors.filter('[value="'+ allowedColors[0] +'"]').prop('checked', true);
                pChangeColor();
                return;
            }
            css.push($skin.val() + '-p-form');
            if($sel.val() !== 'default'){
                css.push('p-form-' + $skin.val() + '-' + $sel.val());
            }
            $form.attr('class', css.join(' '));
        },

        pChangeBackground    = function(){
            jQuery('body').css('background-color', '#' + $backgrounds.filter(':checked').first().val());
        },

        pChangeStyle    = function(){
            $container.attr('class', $container.data('baseClass'));
            $style.filter(':checked').each(function(i, $el){
                $el = jQuery($el);
                if( !$el.is(':checked') || !oStyles[$el.val()] ){ return; }
                $container.addClass( oStyles[$el.val()] );
            });
            $size.filter(':checked').each(function(i, $el){
                $el = jQuery($el);
                if( !$el.is(':checked') || !oSize[$el.val()] ){ return; }
                $container.addClass( oSize[$el.val()] );
            });
            if( $tabsOut.is(':checked') ){
                $container.addClass( 'p-tabs-offset' );
            }
            if( $stepsOut.is(':checked') ){
                $container.addClass( 'p-steps-offset' );
            }
            if( $validation.is(':checked') ){
                $container.addClass( 'p-html-validate' );
            }
            if( $validationHighlight.is(':checked') ){
                $container.addClass( 'p-validate-highlight' );
            }
        },
        pChangeTStyle    = function(type){
            var
                $els        = $container.find('[data-p-role="'+ type +'"]').attr('class', ''),
                $parents    = $els.parent('.p-' + type),
                pClasses    = []
            ;
            $tStyle[type].filter(':checked').each(function(i, $el){
                $el = jQuery($el);
                if( !$el.is(':checked') || !tStyles[$el.val()] ){ return; }
                $els.addClass( tStyles[$el.val()] );
            });
            $tPosition[type].filter(':checked').each(function(i, $el){
                $el = jQuery($el);
                if( !$el.is(':checked') || !tPosition[$el.val()] ){ return; }
                pClasses.push( tPosition[$el.val()] );
            });
            $parents.each(function(i, $el){
                $el = jQuery($el);
                $el.attr('class', $el.data('baseClass') + (pClasses.length ? ' ' + pClasses.join(' ') : '') );
            });
        },
        pChangeBStyle   = function(){
            var $els        = $container.find('.p-buttons, .preview-btn').attr('class', 'preview-btn');
            $tPosition.buttons.filter(':checked').each(function(i, $el){
                $el = jQuery($el);
                if( !$el.is(':checked') || !tPosition[$el.val()] ){ return; }
                $els.addClass( tPosition[$el.val()] );
            });
            if( $buttonBlock.is(':checked') ){
                $els.addClass( 'p-buttons' );
            }
        },
        pChangeSkin     = function(){
            var
                $sel            = $skin.find(':selected'),
                allowedColors   = $sel.data('colors').split(' ')
            ;

            $container.html( jQuery("#p-form-template-" + $skin.val()).html() );

            $colors.each(function(i, $color){
                $color = jQuery($color);
                if( jQuery.inArray($color.val(), allowedColors) < 0 ){
                    $color.closest('.p-radio-color').hide();
                }else{
                    $color.closest('.p-radio-color').show();
                }
            });
            pChangeColor();

            pChangeBackground();
            pChangeStyle();
            pChangeTStyle('title');
            pChangeTStyle('subtitle');
            pChangeBStyle();

            if( jQuery().fpInit !== 'undefined' ){
                $container.fpInit();
            }
        }
    ;

    if( $panel.length ){
        var 
            $ppStyle            = $optionsForm.find('[name="ppStyle[]"]'),
            $panPos             = $optionsForm.find('[name="panPos"]'),
            $panAl              = $optionsForm.find('[name="panAl"]'),
            ppChangeStyle       = function(){
                if( $ppStyle.filter('[value="popup"]').is(':checked') ){
                    $form.find('.p-action-block').addClass('p-popup');
                }else{
                    $form.find('.p-action-block').removeClass('p-popup');
                }
                if( $ppStyle.filter('[value="bg"]').is(':checked') && $ppStyle.filter('[value="popup"]').is(':checked') ){
                    $form.find('.p-popup-bg').css('display', '');
                }else{
                    $form.find('.p-popup-bg').css('display', 'none');
                }
            }
            panChangePosition   = function(){
                $panel.attr('class', $panel.data('baseClass'));
                var
                    pos = $panPos.filter(':checked').val(),
                    al  = $panAl.filter(':checked').val(),
                    css = 'p-pos-'
                ;
                if( pos != 'in' ){
                    css += pos;
                    if( pos === 'top' || pos === 'bottom' ){
                        css += '-' + al;
                    }
                    $panel.addClass('p-fixed ' + css);
                }
            }
        ;

        $ppStyle.on('click.pOForm', function(){
            ppChangeStyle();
        });
        $panPos.on('click.pOForm', function(){
            panChangePosition();
        });
        $panAl.on('click.pOForm', function(){
            panChangePosition();
        });

        ppChangeStyle();
        panChangePosition();
    }

    $skin.on('change.pOForm', function(){
        pChangeSkin();
    });
    $style.on('click.pOForm', function(){
        pChangeStyle();
    });
    $size.on('click.pOForm', function(){
        pChangeStyle();
    });
    $validation.on('click.pOForm', function(){
        pChangeStyle();
    });
    $validationHighlight.on('click.pOForm', function(){
        pChangeStyle();
    });

    $tabsOut.on('click.pOForm', function(){
        pChangeStyle();
    });
    $stepsOut.on('click.pOForm', function(){
        pChangeStyle();
    });

    $tStyle.title.on('click.pOForm', function(){
        pChangeTStyle('title');
    });
    $tPosition.title.on('click.pOForm', function(){
        pChangeTStyle('title');
    });
    $tStyle.subtitle.on('click.pOForm', function(){
        pChangeTStyle('subtitle');
    });
    $tPosition.subtitle.on('click.pOForm', function(){
        pChangeTStyle('subtitle');
    });

    $tPosition.buttons.on('click.pOForm', function(){
        pChangeBStyle();
    });
    $buttonBlock.on('click.pOForm', function(){
        pChangeBStyle();
    });
    $backgrounds.on('click.pOForm', function(){
        pChangeBackground();
    });
    $colors.on('click.pOForm', function(){
        pChangeColor();
    });
    $('body').fpInit();
    pChangeSkin();
});