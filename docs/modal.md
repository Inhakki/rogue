# Rogue.Modal

The modal class allows you to quickly create, show and hide modals as needed.

```javascript
var modalEl = document.createElement('div');
modalEl.innerHTML = '<p>The world\'s simplest modal</p>';

var modal = new Rogue.Modal({
    el: modalEl,
    activeClass: 'modal-active'
});
```

### show

Shows the modal by adding the css class string provided in the `options.activeClass` of the constructor.


```javascript
modal.show();
```

### hide

Hides the modal by removing the css class string provided in the `options.activeClass` of the constructor.


```javascript
modal.hide();
```

### isActive

Returns a truthy if modal is currently active (showing), falsy if not.


```javascript
modal.isActive();
```


### destroy

A function that should be called when the modal is no longer needed that does some cleanup.

```javascript
modal.destroy();
```