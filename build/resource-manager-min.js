/** 
* rogue - v2.6.2.
* git://github.com/mkay581/rogue.git
* Copyright 2015 Mark Kennedy. Licensed MIT.
*/
var Promise=require("promise"),request=require("request"),ResourceManager=function(){this.initialize()};ResourceManager.prototype={initialize:function(){this._head=document.getElementsByTagName("head")[0],this._cssPaths={},this._scriptPaths={}},loadScript:function(a){var b;return this._loadScriptPromise=this._loadScriptPromise?Promise.resolve():new Promise(function(c){a=this._ensurePathArray(a),a.forEach(function(a){this._scriptPaths[a]||(this._scriptPaths[a]=a,b=this.createScriptElement(),b.setAttribute("type","text/javascript"),b.src=a,b.addEventListener("load",c),this._head.appendChild(b))}.bind(this))}.bind(this)),this._loadScriptPromise},unloadScript:function(a){var b;return new Promise(function(c){a=this._ensurePathArray(a),a.forEach(function(a){b=this._head.querySelectorAll('script[src="'+a+'"]')[0],b&&(this._head.removeChild(b),this._scriptPaths[a]=null)}.bind(this)),c()}.bind(this))},createScriptElement:function(){return document.createElement("script")},loadCss:function(a){return new Promise(function(b){a=this._ensurePathArray(a),a.forEach(function(a){if(!this._cssPaths[a]){var b=document.createElement("link");b.setAttribute("rel","stylesheet"),b.setAttribute("href",a),this._head.appendChild(b),this._cssPaths[a]=b}}.bind(this)),b()}.bind(this))},unloadCss:function(a){var b;return new Promise(function(c){a=this._ensurePathArray(a),a.forEach(function(a){b=this._cssPaths[a],b&&(this._head.removeChild(b),this._cssPaths[a]=null)}.bind(this)),c()}.bind(this))},loadTemplate:function(a,b){return new Promise(function(c){return request(a).then(function(a){b&&(b.innerHTML=a,a=b),c(a)})})},_ensurePathArray:function(a){return"string"==typeof a&&(a=[a]),a},flush:function(){this.unloadCss(Object.getOwnPropertyNames(this._cssPaths)),this._cssPaths={},this.unloadScript(Object.getOwnPropertyNames(this._scriptPaths)),this._scriptPaths={},this._loadScriptPromise=null}},module.exports=new ResourceManager;