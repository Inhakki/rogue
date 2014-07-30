define(function () {

    var TestUtils = function () {};

    TestUtils.prototype = {

        /**
         * Creates an event.
         * @param {string} name - The event name
         * @param {object} options - Options to be passed to event
         */
        createEvent: function (name, options) {
            var event,
                bubbles,
                cancelable,
                options = options || {};
            if (typeof Event === 'function') {
                event = new Event(name, options);
            } else {
                // must register click old-fashioned way so that running tests headlessly will work
                event = document.createEvent('Event');
                bubbles = options.bubbles || false;
                cancelable = options.cancelable || false;
                event.initEvent(name, bubbles, cancelable);
            }
            return event;
        }

    };

    return new TestUtils();

});
