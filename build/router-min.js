/** 
* rogue - v2.8.1.
* git://github.com/mkay581/rogue.git
* Copyright 2015 Mark Kennedy. Licensed MIT.
*/
"use strict";var ResourceManager=require("resource-manager"),request=require("request"),Promise=require("promise"),path=require("path"),_eval=require("eval"),EventManager=require("event-manager"),Handlebars=require("handlebars"),slugify=require("handlebars-helper-slugify"),_=require("underscore"),Router=function(a){return this.initialize(a),this};Router.prototype={initialize:function(a){this.options=a||{},EventManager.createTarget(this),this._pageMaps={},this._moduleMaps={},this._history=[],Handlebars.registerHelper("slugify",slugify)},start:function(){this._config=this.options.config,this._config||console.error("RouteManager error: no configuration data was supplied."),this.triggerRoute(window.location.pathname),window.addEventListener("popstate",this._getRouteRequestListener())},_getRouteRequestListener:function(){var a=this;return function(){return a._onRouteRequest.bind(a)}},reset:function(){this._history=[],this._pageMaps={}},stop:function(){window.removeEventListener("popstate",this._getRouteRequestListener())},triggerRoute:function(a){return a!==this._currentPath?(history.pushState({path:a},document.title,a),this._onRouteRequest(a)):Promise.resolve()},goBack:function(a){a?window.history.go(a):window.history.back()},goForward:function(a){a?window.history.go(a):window.history.forward()},getRelativeUrlParams:function(){return this.getRelativeUrl().split("/")||[]},getRelativeUrl:function(){return this._currentPath||window.location.hash.replace("#","")},getHistory:function(){return this._history},_storeHistory:function(a){this._history.push({path:a[0]})},_onRouteRequest:function(a){return new Promise(function(b){a&&a!==this._currentPath?(this._currentPath=a,this.showPage(a).then(function(){this._loaded||(this._loaded=!0,b(),this.dispatchEvent("page:load"))}.bind(this)),this.dispatchEvent("url:change")):b()}.bind(this))},showPage:function(a){a="/"===a[0]?a.substr(1):a,a||(a="index");var b,c,d=this._config.pages[a],e={};return this._pageMaps[a]?(this._pageMaps[a].show(),Promise.resolve()):(this._pageMaps[a]=e,e.promise=ResourceManager.loadTemplate(d.template).then(function(a){return b=e.page=require(d.script),b.getData(d.data).then(function(e){return this.registerModules(d.modules).then(function(d){return c=Handlebars.compile(a)(e),b.load({template:c}).then(function(){return this.loadModules(d)}.bind(this))}.bind(this))}.bind(this))}.bind(this)),e.promise)},loadModules:function(a){var b=[];return _.each(a,function(a){a.module&&b.push(a.module.load())}),Promise.all(b)},registerModules:function(a){var b,c=[],d=[];return a.forEach(function(a){if(b=this._config.modules[a],b||c.push(!0),this._moduleMaps[a])this._moduleMaps[a].show(),c.push(!0);else{var e={};e.promise=this._fetchModule(a).then(function(a){d.push(a)}),this._moduleMaps[a]=e,c.push(e.promise)}}.bind(this)),Promise.all(c).then(function(){return Promise.resolve(d)})},_fetchModule:function(a){var b,c,d,e={},f=this._config.modules[a];return e.promise=ResourceManager.loadTemplate(f.template).then(function(g){return f.script?(b=e.module=require(f.script),d=b.getData(f.data)):d=Promise.resolve(),d.then(function(b){return c=Handlebars.compile(g)(b),Handlebars.registerPartial(a,c),Promise.resolve(e)})}.bind(this)),e.promise}},module.exports=function(a){return new Router(a)};