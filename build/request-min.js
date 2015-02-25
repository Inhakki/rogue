/** 
* rogue - v2.5.0.
* git://github.com/mkay581/rogue.git
* Copyright 2015 Mark Kennedy. Licensed MIT.
*/
"use strict";var Promise=require("promise");module.exports=function(a,b){var c=new XMLHttpRequest;return b=b||{},b.method=b.method||"GET",b.headers=b.headers||{},b.async="undefined"==typeof b.async?!0:b.async,new Promise(function(d,e){c.open(b.method,a);for(var f in b.headers)b.headers.hasOwnProperty(f)&&c.setRequestHeader(f,b.headers[f]);c.onreadystatechange=function(){4==this.readyState&&200==this.status?d.call(this,this.responseText):4==this.readyState&&e.call(this,this.status,this.statusText)},c.send(b.data)})};