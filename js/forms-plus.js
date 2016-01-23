/* global formsPlus: true, console, moment */
formsPlus                                           = {
    debug                                           : false,
    initFn                                          : [],                               // Array of functions to run on init
    css                                             : {},
    dateFormat                                      : 'DD.MM.YYYY hh:mm a',
    selectors                                       : {
        formGroup                                       : '.form-group',
        fieldWrap                                       : '.input-group, .p-field-group',
        validationWrap                                  : '.form-group, .p-field-group',
        form                                            : '.p-form, form'
    },
    log                                             : function(msg){
        if( formsPlus.debug && window.console ){
            console.log( msg );
        }
        return formsPlus;
    },
    pluginCheck                                     : function(elements, $err){         // Check if there is some elements
        if ( !elements.length ) {
            if ( $err ) {
                formsPlus.log( $err );
            }
            return false;
        }
        return true;
    },
    hasDataString                                   : function($el, name){              // Check element has data attribute and it's string
        return $el.data(name) && typeof($el.data(name)) === 'string';
    },
    isInt                                           : function(value){
        return Number(value) === value && value % 1 === 0;
    },
    isFloat                                         : function(value){
        return value === Number(value) && value % 1 !== 0;
    },
    toNumber                                        : function(value){
        value                                       = Number( value );
        return isNaN(value) ? null : value;
    },
    getFloatLength                                  : function(value){
        if( !formsPlus.isFloat(value) ){
            return 0;
        }
        value                                       = (value + "").split('.');
        return value.length > 1 ? value[1].length : 0;
    },
    inRange                                         : function( value, min, max ){
        if( typeof(min) !== 'number' || typeof(max) !== 'number' ){
            return value;
        }
        value                                       = formsPlus.toNumber(value) || 0;
        if( typeof(min) === 'number' && value < min ){
            return min;
        }
        if( typeof(max) === 'number' && value > max ){
            return max;
        }
        return value;
    },
    getAttribute                                    : function($el, name){
        if( typeof( $el.attr(name) ) !== 'undefined' ){
            return $el.attr(name);
        }
        if( typeof( $el.attr('data-js-' + name) ) !== 'undefined' ){
            name    = ('js-' + name).replace(/-[a-z]/g, function (str) {
                return str.charAt(1).toUpperCase();
            });
            return $el.data(name);
        }
        return;
    },
    getRangeObject                                  : function(objs, value){
        var ret                                     = false;
        jQuery.each(objs, function(i, obj){
            if( value >= obj.from && (!ret || ret.from < obj.from) ){
                ret                                 = obj;
            }
        });
        return ret;
    },
    find                                            : function($el, defaultSel, defaultType){
        var
            type                                    = $el.data('jsSelectorType') || defaultType || 'find',
            selector                                = $el.data('jsSelector') || defaultSel
        ;
        if( type === 'root' ){
            return jQuery(selector);
        }
        if( !type || !jQuery()[type] ){
            return jQuery([]);
        }
        return $el[type](selector);
    },
    getDataOptions                                  : function($el, pref, allowed){
        var
            ret                                     = {},
            data                                    = $el.data()
        ;
        if( !pref && !allowed ){
            return data;
        }
        jQuery.each(data, function(name, value){
            if( pref ){
                if( !name.match("^" + pref) ){
                    return;
                }
                if( allowed ){
                    name                            = name.charAt( pref.length ).toLowerCase() + name.slice( pref.length + 1 );
                }
            }
            if( allowed && jQuery.inArray(name, allowed) === -1){
                return;
            }
            ret[name]                               = value;
        });
        return ret;
    },
    getMoment                                       : function(value, format, useStrict){
        if( typeof(moment) === 'undefined' ){
            formsPlus.log('Please include moment.js!');
            return null;
        }
        try{
            return moment(value, format, useStrict);
        }catch(e){
            formsPlus.log('getMoment error:');
            formsPlus.log(e);
            return null;
        }
    },
    toDate                                          : function(str, parseFormats, useStrict, date){
        if( typeof(moment) === 'undefined' ){
            formsPlus.log('Please include moment.js!');
            return null;
        }
        if( str === null ){
            return null;
        }
        if( typeof(str) === 'object' && str.isValid && str.isValid() ){
            return str;
        }
        try{
            if( str === 'today' ){
                str                                     = moment(new Date()).startOf('day');
            }else if( str === 'tomorrow' ){
                str                                     = moment(new Date()).startOf('day').add(1, 'day');
            }else if( jQuery.inArray(str.charAt(0), ['-', '+']) !== -1 ){
                date                                    = date || moment(new Date()).startOf('day');
                switch( str.charAt(0) ){
                    case '+'                                :
                        str                             = date.add( parseInt(str), str.split(' ').pop() );
                        break;
                    case '-'                                :
                        str                             = date.subtract( parseInt(str), str.split(' ').pop() );
                        break;
                }
            }else{
                parseFormats                            = parseFormats || formsPlus.dateFormat;
                useStrict                               = useStrict || false;
                str                                     = moment(str, parseFormats, useStrict );
            }
        }catch(e){
            formsPlus.log('toDate error:');
            formsPlus.log(e);
            return null;
        }
        return str;
    },
    randomId                                        : function() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1)
            ;
        }
        return s4() + s4();
    },
    /*
        @arguments obj, returnObj, properties...
            obj                                     - object to get values from
            returnObj                               - if true and obj is not object returns obj
            properties...                           - one or more property to get in format
                format:
                    'propertyName'                  - returns 'propertyName' object property or null
                    'propertyName1,propertyName2'   - returns first set object property or null
        @return
            depending on <properties...> returns single value or array of specified properties values

        @examples
            obj = 'some text'
            formsPlus.getObjProp(obj, true, 'name')                         - 'some text'

            obj = {
                name    : 'my name',
                title   : 'my title',
                email   : 'mail@mail.com',
                login   : 'nickname'
            }
            formsPlus.getObjProp(obj, false, 'text')                            - null
            formsPlus.getObjProp(obj, false, 'title')                           - 'my title'
            formsPlus.getObjProp(obj, true, 'title')                            - 'my title'
            formsPlus.getObjProp(obj, false, 'login,email')                     - 'nickname'
            formsPlus.getObjProp(obj, false, 'description,title')               - 'my title', because object doesn't have 'description' property
            formsPlus.getObjProp(obj, false, 'login', 'email')                  - ['nickname', 'mail@mail.com']
            formsPlus.getObjProp(obj, false, 'name', 'login,email', 'title')    - ['nickname', 'nickname', 'my title']
            formsPlus.getObjProp(obj, false, 'name', 'phone,email', 'address')  - ['nickname', 'mail@mail.com', null]
    */
    getObjProp                                      : function(obj, returnObj){
        if( typeof(obj) !== 'object' || arguments.length < 3 ){
            return returnObj ? obj : null;
        }
        var
            props                                   = arguments.slice(2),
            check                                   = function(obj, prop){
                prop                                = prop.split(',');
                var value                           = null;
                for (var j = 0; j < prop.length; j++) {
                    if( typeof(obj[prop[j]]) !== 'undefined' ){
                        value                       = obj[prop[j]];
                    }
                }
                return value;
            }
        ;
        if( props.length === 1 ){
            return check(obj, props[0]);
        }else{
            var ret                                 = [];
            for (var i = 0; i < props.length; i++) {
                ret.push( check(obj, props[i]) );
            }
            return ret;
        }
    }
};

jQuery.event.special.destroyproxy   = {
    //only triggered when element is trully be removed
    remove: function(){
        var
            $el                     = jQuery(this),
            funcs                   = $el.data('destroyProxyFunc')
        ;
        if( funcs ){
            jQuery.each(funcs, function(i, func){
                func.apply(this, []);
            });
        }
    }
};
jQuery.event.special.destroyed      = {
    add     : function(o){
        if (o.handler) {
            var
                $el                 = jQuery(this),
                funcs               = $el.data('destroyProxyFunc') || {}
            ;
            funcs[o.guid]           = o.handler;
            $el.data('destroyProxyFunc', funcs );
            if( !$el.data('hasDestroyProxy') ){
                $el.data('hasDestroyProxy', true);
                $el.on('destroyproxy', function(){});
            }
        }
    },
    remove  : function(o) {
        if (o.handler) {
            setTimeout( function(){
                var
                    $el                 = jQuery(this),
                    funcs               = $el.data('destroyProxyFunc')
                ;
                if( funcs && funcs[o.guid] ){
                    delete funcs[o.guid];
                }
                $el.data('destroyProxyFunc', funcs );
            }, 0 );
        }
    }
};

jQuery.fn.fpInit         = function(){
    if( !formsPlus.pluginCheck(this, "Forms Plus: init - Nothing selected.") ){
        return this;
    }
    jQuery(this).trigger('fpInitStart');
    for (var i = 0; i < this.length; i++) {
        var $container                              = jQuery(this[i]);
        $container.trigger('fpBeforeInit');
        for (var j = 0; j < formsPlus.initFn.length; j++) {
            formsPlus.initFn[j]( $container );
        }
        $container.trigger('fpAfterInit');
    }
    jQuery(this).trigger('fpInitEnd');
    return this;
};