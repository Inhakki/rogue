var sinon = require('sinon');
var assert = require('assert');

describe('Request', function (){
    it('should resolve with correct html contents', function (done){
        var url = 'path/to/template.html';
        var server = sinon.fakeServer.create();
        var request = require('./../src/request');
        var html = '<div></div>';
        server.respondWith(url, html);
        request(url).then(function (contents) {
            assert.equal(contents, html, 'after request returns, correct html is passed when resolved');
            done();
        });
        server.respond();
    });
});
