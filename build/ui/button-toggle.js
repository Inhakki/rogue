window.Core = Core || {};

var ButtonToggle = function (options) {
    this.initialize(options);
    return this;
};

ButtonToggle.prototype = {

    /**
     * Initializes the toggle button.
     * @param {object} options - Options to pass
     */
    initialize: function (options) {

        options = utils.extend({
            selector: null,
            onChange: null
        }, options);

    },

    /**
     * Sets up radius button for toggling.
     * @param {Event} e - Event
     * @private
     */
    _onRadiusButtonClick: function _onRadiusButtonClick (e) {
        var button = e.currentTarget,
            parentEl = button.parentNode,
            parentHasButtonClass = parentEl.className.indexOf('button-toggle') !== -1;

        if (parentEl && parentHasButtonClass) {
            if (button.checked) {
                utils.addClass(parentEl, 'selected');
            } else {
                utils.removeClass(parentEl, 'selected');
            }
        }
    }
};