'use strict';
var Promise = require('promise');

/**
 * A ES6-Promisified XHR request class to make ajax calls.
 * @module request
 * @type {exports}
 * @param {String} url - The url to be requested
 * @param {Object} [options] - The options
 * @param {String} [options.method] - The method (i.e. "GET", "POST"), defaults to GET
 * @param {Object} [options.headers] - Any headers to send with request
 * @param {Boolean} [options.async] - Whether this is an asynchronous call (default to true)
 * @returns {Promise}
 * @TODO: make this return a promise that follows ES6 Promise syntax
 */
module.exports = function (url, options) {
    var client = new XMLHttpRequest();

    options = options || {};
    options.method = options.method || 'GET';
    options.headers = options.headers || {};
    options.async = typeof options.async === 'undefined' ? true : options.async;


    return new Promise(
        function (resolve, reject) {
            // open connection
            client.open(options.method, url);

            // deal with headers
            for (var i in options.headers) {
                if (options.headers.hasOwnProperty(i)) {
                    client.setRequestHeader(i, options.headers[i]);
                }
            }
            // listener
            client.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    resolve.call(this, this.responseText);
                } else if (this.readyState == 4) {
                    reject.call(this, this.status, this.statusText);
                }
            };
            // send off
            client.send(options.data);
        });

};