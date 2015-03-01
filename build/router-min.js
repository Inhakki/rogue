/** 
* rogue - v2.6.0.
* git://github.com/mkay581/rogue.git
* Copyright 2015 Mark Kennedy. Licensed MIT.
*/
"use strict";var ResourceManager=require("resource-manager"),request=require("request"),promise=require("promise"),path=require("path"),_eval=require("eval"),EventManager=require("event-manager"),Handlebars=require("handlebars"),Router=function(a){return this.initialize(a),this};Router.prototype={initialize:function(a){this.options=a||{},EventManager.createTarget(this),this._pageMaps={},this._setupHelpers(a)},_setupHelpers:function(a){a.handlebars=a.handlebars||{};var b,c=a.handlebars.helpers;if(c)for(b in c)c.hasOwnProperty(b)&&Handlebars.registerHelper(b,c[b])},start:function(){this._pages={},this._history=[],EventManager.createTarget(this),this._fetchConfig(this.options.config).then(function(a){this._config=a,this.triggerRoute(window.location.pathname),window.addEventListener("popstate",this._getRouteRequestListener())}.bind(this))},_fetchConfig:function(a){return a||console.error("RouteManager error: no configuration data was supplied."),new Promise(function(b){"string"==typeof a?request(a).then(function(a){a=_eval(a),b(a)}):b(a)})},_getRouteRequestListener:function(){var a=this;return function(){return a._onRouteRequest.bind(a)}},reset:function(){this._history=[],this._pages={}},stop:function(){window.removeEventListener("popstate",this._getRouteRequestListener())},triggerRoute:function(a){return history.pushState({path:a},document.title,a),this._onRouteRequest(a)},goBack:function(a){a?window.history.go(a):window.history.back()},goForward:function(a){a?window.history.go(a):window.history.forward()},getRelativeUrlParams:function(){return this.getRelativeUrl().split("/")||[]},getRelativeUrl:function(){return this._currentPath||window.location.hash.replace("#","")},getHistory:function(){return this._history},_storeHistory:function(a){this._history.push({path:a[0]})},_onRouteRequest:function(a){a!==this._currentPath&&(this._currentPath=a,this.showPage(a).then(function(){this._loaded||(this._loaded=!0,this.dispatchEvent("page:load"))}.bind(this)),this.dispatchEvent("url:change"))},showPage:function(a){var b,c=this._config[a],d={};return this._pageMaps[a]?(this._pageMaps[a].show(),promise.resolve()):(this._pageMaps[a]=d,d.promise=ResourceManager.loadTemplate(c.template).then(function(a){b=d.page=require(c.script),d.promise=this._compileTemplate(a,c.data).then(function(a){return b.load({template:a})}.bind(this))}.bind(this)),d.promise)},_compileTemplate:function(a,b){return request(b).then(function(b){return b=JSON.parse(b),promise.resolve(Handlebars.compile(a)(b))})}},module.exports=function(a){return new Router(a)};