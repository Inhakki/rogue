# Examples

The following are examples of how to use the classes in Rogue. 

## Modal

The modal class essentially takes a set of html and injects it into the DOM in a centralized place in which you would like it.
Multiple instances will be injected in the same central DOM container. 

### HTML

```html
<div class="my-modal-content">
    <p>My Content</p>
</div>
```

### JS

```javascript
var content = document.getElementByClassName('my-modal-content')[0];
var modal = new Modal({
    el: content,
    activeClass: 'modal-active'
});
modal.setup();
```
Instantiating and calling setup() on the modal instance will cause the following to happen:
 
 1. the `el` will be injected into the modal container (either the `<body>` of the page or whatever you pass in the `containerEl` option)
  
### Output

Once instantiated, your modal content will be injected into the `<body>` element of the page, like so:

```html
<body>
    <div class="my-modal-content">
        <p>My Content</p>
    </div>
</body>
```
You'll need to style the css appropriately. Generally, a good practice is to hide all modals that sit inside of the container and only show the modals with the active class applied.

### CSS

```css
body {
    position: absolute;
    top: 0;
    left: 0;
}

.my-modal-content {
    display: none;
}

/* When the modal is active */
.my-modal-content.modal-active {
    display: block;
}
```
