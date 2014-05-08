var AKQA = AKQA || {};

AKQA.Lib = AKQA.Lib || {};

AKQA.Lib.ResizeManager = (function(){
    'use strict';

    var _config = {
        resizeThrottle : 50,    // limits how often handlers are fired, if many resize events come in quick succession
        callbackThrottle : 100  // limits how quickly different resize callbacks are fired
    },

    // An array to hold the various, passed-in, resize functions
    _callbacks = [],

    // An initialization function to kick everything off
    _init = function _init() {
        _listenForResizeEvent();
    },

    // Set up the resize event handler
    _listenForResizeEvent = function _listenForResizeEvent() {

        /* A variable for the ensuing timeout.  In order to not fire
           the collectd resize events on every single resize event, we
           only run our callbacks if the fired resize event has been
           fired outside a set timeframe. */
        var timeout = null;

        // The resize event handler
        window.onresize = function() {
            // Stop previously kicked off handlers
            clearTimeout(timeout);

            /* Set up a new timeout ... eventually, the user will stop
               resizing and the timeout will run through */
            timeout = setTimeout(function(){
                // A hoisted iterator for the number of callbacks
                var i = 0;

                for (; i < _callbacks.length; i++) {
                    // Run the current callback
                    _applyCallback(i);
                }
            }, _config.resizeThrottle);
        };
    },

    // Add a resize function to the _callbacks array
    _addCallback = function _addCallback(callback) {
        _callbacks.push(callback);
    },

    // Run the callback associated with the passed index
    _applyCallback = function applyCallback(index) {

        /* Many resize events can cause significant changes to the
           structure of the page, leading to a lot of repaints and
           reflows.  On lesser powered devices, this can lead to poor
           performance.  We help to combat this by not firing all
           resize events immediately after each other. */
        setTimeout(function(){
            _callbacks[index]();
        }, (index * _config.callbackThrottle));

    };

    return {
        init : _init,
        addCallback : _addCallback
    };
}());