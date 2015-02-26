/** 
* rogue - v2.5.2.
* git://github.com/mkay581/rogue.git
* Copyright 2015 Mark Kennedy. Licensed MIT.
*/
"use strict";var ResourceManager=require("resource-manager"),request=require("request"),Promise=require("promise"),path=require("path"),_eval=require("eval"),Router=function(a){return this.options=a||{},this};Router.prototype={start:function(){this._pages={},this._history=[],this._fetchConfig(this.options.config).then(function(a){this._config=a,this.triggerRoute(window.location.pathname),window.addEventListener("popstate",this._getRouteRequestListener())}.bind(this))},_fetchConfig:function(a){return a||console.error("RouteManager error: no configuration data was supplied."),new Promise(function(b){"string"==typeof a?request(a).then(function(a){a=_eval(a),b(a)}):b(a)})},_getRouteRequestListener:function(){var a=this;return function(){return a._onRouteRequest.bind(a)}},reset:function(){this._history=[],this._pages={}},stop:function(){window.removeEventListener("popstate",this._getRouteRequestListener())},triggerRoute:function(a){return history.pushState({path:a},document.title,a),this._onRouteRequest(a)},goBack:function(a){a?window.history.go(a):window.history.back()},goForward:function(a){a?window.history.go(a):window.history.forward()},getRelativeUrlParams:function(){return this.getRelativeUrl().split("/")||[]},getRelativeUrl:function(){return this._currentPath||window.location.hash.replace("#","")},getHistory:function(){return this._history},_storeHistory:function(a){this._history.push({path:a[0]})},_onRouteRequest:function(a){a!==this._currentPath&&(this._currentPath=a,this.options.onUrlChange&&this.options.onUrlChange(a))}},module.exports=function(a){return new Router(a)};