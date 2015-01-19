# Rogue

Rogue is a lightweight, un-opinionated library that provides helpful javascript classes to create super fast web-based, single-page apps.

This library is built using native vanilla javascript. This means things will process a lot faster than other front-end libraries like jQuery and Dojo and contain a lot less bloat.
It also supports IE9+ and all modern browsers (including mobile).

## Components

Some of the components included in Rogue are:

### Carousels

```javascript
var carousel = new Rogue.Carousel({
    panels: document.getElementsByClassName('carousel-panel'),
    thumbnails: document.getElementsByClassName('carousel-thumbnail')
});

carousel.goTo(1); // go to second carousel item
```

A working example of how to create a carousel can be found [here](examples/carousel.html).

### Modals

```javascript
var modal = new Rogue.Modal({
    el: modalEl,
    containerEl: document.getElementsByClassName('modals-container')[0],
    activeClass: 'modal-active'
});

modal.setup(); // inject the html element into the modal container in the DOM
modal.show(); // show the modal

```
A working example of how to create a modal can be found [here](examples/modal.html).

## Dependencies

Only dependency is [ElementKit](https://github.com/mkay581/element-kit), used for fast, cross-browser DOM manipulation for HTML Elements.

## API Documentation

Documentation can be found [here](http://mkay581.github.io/rogue/api/current/).

## Usage

Detailed usage and specific examples can be found in the [Examples](https://github.com/mkay581/rogue/blob/master/examples).

## Contributing

To contribute to Rogue, check out the [Contributing readme](https://github.com/mkay581/rogue/blob/master/CONTRIBUTING.md).

## Release History

 * 2014-12-29   v2.2.0   New Carousel class!
 * 2014-07-12   v2.1.0   Official release.
 * 2014-10-23   v2.0.3   Modules are now IE9 compatible.
