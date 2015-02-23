# Rogue

Rogue is a lightweight library of fast, un-opinionated modules. The javascript in this library does NOT make any assumptions about CSS styling.
In fact, the CSS for each module is totally up to you.  The library only provides the javascript logic that is necessary for your module
 and gets out of your way, making it lightweight, scalable and flexible when implementing.

This library is built using native vanilla javascript. This means things will process a lot faster than other front-end libraries like jQuery and Dojo and contain a lot less bloat.
It also supports IE9+ and all modern browsers (including mobile).

## Dependencies

To use Rogue, you'll need:

* [RequireJS](http://requirejs.org/) - AMD and dependency management
* [ElementKit](https://github.com/mkay581/element-kit) - Fast, cross-browser DOM manipulation and IE9+ support
* [Underscore](http://underscorejs.org/) - For programming goodies

Of course, if you use [Bower's](http://bower.io/) `bower install` to install this project, it will automatically inject all of the above dependencies for you.

## API Documentation

Documentation can be found [here](http://mkay581.github.io/rogue/api/current/).

## Examples

Detailed usage and specific examples can be found in the [Examples](https://github.com/mkay581/rogue/blob/master/examples).


## Carousels

Create a carousel based off of a set of predetermined markup. Assuming, you have your html in the DOM and CSS
set up correctly. You can do:

```javascript
var carousel = new Rogue.Carousel({
    panels: document.getElementsByClassName('carousel-panel'),
    thumbnails: document.getElementsByClassName('carousel-thumbnail')
});

carousel.goTo(1); // go to second carousel item
```

A details on how to create a carousel can be found [here](examples/carousel.html).

## Modals

Create one or more modals with a few lines of javascript. With your html and css setup correctly, you can do:

```javascript
var modal = new Rogue.Modal({
    el: $('<div class="my-modal">My Modal Content</div>')[0],
    containerEl: $('modals-container')[0],
    activeClass: 'modal-active'
});

modal.setup(); // inject the modal's html into the modal container
modal.show(); // show the modal
modal.hide(); // hide the modal

```
A more advanced example of how to create a modal can be found [here](examples/modal.html).


## Contributing

To contribute to Rogue, check out the [Contributing readme](https://github.com/mkay581/rogue/blob/master/CONTRIBUTING.md).

## Release History

 * 2015-01-25   v2.3.0   New Resource Manager
 * 2014-12-29   v2.2.0   New Carousel class!
 * 2014-07-12   v2.1.0   Official release.