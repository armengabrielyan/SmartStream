/* 
 * @author Armen Gabrielyan <armen.gabrielyan@bigbrain.am, aggabriel88@gmail.com>
 * @copyright (c) 2013, bigbrain.am
 */

/**
 * System utilities abstraction layer
 */
var SystemUtils = (function() {
    var u = {};
    var simpleXHR = null;


    u.jsonEncode = function(obj) {
        return sf.util.obj2json(obj);
    };
    u.jsonDecode = function(json) {
        return eval('('+json+')');
    };
    u.inArray = function(needle, haystack) {
        return sf.util.inArray(needle, haystack);
    };
    u.widgetId = function(){
        return curWidget.id;
    };
    
    u.simplePromiseSet = function(){
        return simpleXHR = (new Date()).getTime();
    };
    u.simplePromiseResolve = function(data){
        console.log(simpleXHR, data, simpleXHR == data);
        return (simpleXHR == data);
    };
    
    return u;
})();
