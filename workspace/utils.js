define([
    frameworkConfig.modulePath + '/framework',
    frameworkConfig.modulePath + '/libs/core-modules/akqa-core/utils'
],
function (App, CoreUtils) {

    var Utils = {

        /**
         * Adds a CSS class to an element.
         * @param {HTMLElement} el - The element to add a class to.
         * @param {string} className - The css class value to add
         */
        addClass: function  (el, className) {
            if (!this.hasClass(el, className)) {
                el.className = el.className + ' ' + className;
            }
        },

        /**
         * Remvoes a CSS class from an element.
         * @param {HTMLElement} el - The element to remove class from.
         * @param {string} className - The css class value to remove
         */
        removeClass: function (el, className) {
            if (this.hasClass(el, className)) {
                el.className = el.className.replace(className, '');
            }
        },

        /**
         * Checks if an element has a class.
         * @param {HTMLElement} el - The element to check.
         * @param {string} className - The css class value to check
         */
        hasClass: function (el, className) {
            return el.className.indexOf(className) !== -1;
        },

        /**
         * Creates an HTML Element from an html string.
         * @param {string} html - String of html
         * @returns {HTMLElement} - Returns and html element node
         */
        createHtmlElement: function (html) {
            var tempParentEl;
            if (html) {
                tempParentEl = document.createElement('div');
                tempParentEl.innerHTML = html;
                return tempParentEl.childNodes[1];
            }
        },

        /**
         * Gets a simplified mapping of all attributes of an element.
         * @param {HTMLElement} el - The element containing attributes
         * @returns {object} - Returns an object containing all attribute mappings
         */
        getElementAttrMap: function (el) {
            var attrs = el.attributes,
                map = {};
            if (attrs.length) {
                for (var i = 0; i < attrs.length; i++) {
                    map[attrs[i].name] = attrs[i].value;
                }
            }
            return map;
        },

        /**
         * Checks if browser is IE 8.
         * @returns {boolean} Returns true if the current browser is IE 8.
         */
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
