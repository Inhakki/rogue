/** 
* rogue - v2.5.1.
* git://github.com/mkay581/rogue.git
* Copyright 2015 Mark Kennedy. Licensed MIT.
*/
"use strict";var utils=require("./utils"),CarouselPanels=require("./carousel-panels"),CarouselThumbs=require("./carousel-thumbs"),ElementKit=require("element-kit"),Carousel=function(a){this.initialize(a)};Carousel.prototype={initialize:function(a){this.options=utils.extend({panels:[],assetClass:null,assetLoadingClass:"carousel-asset-loading",autoLoadAssets:!0,panelActiveClass:"carousel-panel-active",onPanelChange:null,lazyLoadAttr:"data-src",thumbnails:[],thumbnailActiveTriggerEvent:"click",thumbnailActiveClass:"carousel-thumbnail-active",initialIndex:0},a),this._checkForInitErrors(),this.setup()},setup:function(){this.panels=new CarouselPanels(utils.extend({},this.options,{onChange:this.onPanelChange.bind(this)})),this.options.thumbnails.length&&(this.thumbnails=new CarouselThumbs(utils.extend({},this.options,{onChange:this.onThumbnailChange.bind(this)}))),"number"==typeof this.options.initialIndex&&this.goTo(this.options.initialIndex)},_checkForInitErrors:function(){var a=this.options,b=a.panels.length,c=a.thumbnails.length;c&&c!==b&&console.warn("carousel warning: number of thumbnails passed in constructor do not equal the number of panels\npanels: "+b+"\nthumbnails: "+c+"\n")},onPanelChange:function(a){this.thumbnails&&this.thumbnails.goTo(a),this.options.onPanelChange&&this.options.onPanelChange(a)},onThumbnailChange:function(a){this.goTo(a)},goTo:function(a){var b=this.options,c=b.panels.length-1,d=0;a>c?a=d:d>a&&(a=c),this.panels.goTo(a),this.thumbnails&&this.thumbnails.goTo(a)},goToPanel:function(a){this.goTo(a)},getCurrentIndex:function(){return this.panels.getCurrentIndex()},destroy:function(){this.panels.destroy(),this.thumbnails&&this.thumbnails.destroy()}},module.exports=Carousel;