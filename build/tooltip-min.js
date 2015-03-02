/** 
* rogue - v2.6.4.
* git://github.com/mkay581/rogue.git
* Copyright 2015 Mark Kennedy. Licensed MIT.
*/
"use strict";var utils=require("utils"),ElementKit=require("element-kit"),Tooltip=function(a){this.initialize(a)};Tooltip.prototype={initialize:function(a){this.options=utils.extend({el:null,showEvent:null,hideEvent:null,onShow:null,onHide:null,cssPrefix:"ui-tooltip"},a),this.prefix=this.options.cssPrefix,this.activeClass=this.prefix+"-active",this.el=this.options.el,this.trigger=this.el.getElementsByClassName(this.prefix+"-trigger")[0],this.setup()},setup:function(){var a=this.options;a.showEvent&&(this.eventMap=this._setupEvents(a.showEvent,a.hideEvent))},_setupEvents:function(a,b){var c,d,e=this._buildEventMap(a,b);for(c in e)e.hasOwnProperty(c)&&(d=e[c],this.trigger.addEventListener(d.name,d.event));return e},_onDuplicateEvent:function(){this.isActive()?this.hide():this.show()},_buildEventMap:function(a,b){var c={};return a===b?(c.showEvent={name:a,event:this._onDuplicateEvent.bind(this)},c):(a&&(c.showEvent={name:a,event:this.show.bind(this)}),b&&(c.hideEvent={name:b,event:this.hide.bind(this)}),c)},show:function(){this.el.kit.classList.add(this.activeClass),this.options.onShow&&this.options.onShow()},hide:function(){this.el.kit.classList.remove(this.activeClass),this.options.onHide&&this.options.onHide()},isActive:function(){return this.el.kit.classList.contains(this.activeClass)},destroy:function(){var a,b,c=this.eventMap;if(c)for(a in c)c.hasOwnProperty(a)&&(b=c[a],this.trigger.removeEventListener(b.name,b.event))}},module.exports=Tooltip;