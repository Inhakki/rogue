require([
    './dist/akqa-core/utils'
],
function (CoreUtils) {

    var Utils = function (options) {
        return this;
    };

    Utils.prototype = {

        addClass: function  (el, className) {

        },

        removeClass: function (el, className) {

        },

        isIE8: function () {
            var rv = -1;
            var ua = navigator.userAgent;
            var re = new RegExp("Trident\/([0-9]{1,}[\.0-9]{0,})");
            if (re.exec(ua) != null) {
                rv = parseFloat(RegExp.$1);
            }
            return (rv == 4);
        }

    };

    return Utils;
});
