# General API

1. [UI Element Classes](#ui-classes)
    * [Checkbox](#checkbox)
1. [Methods](#methods)

<a name="ui-classes"></a>
## UI Element Classes

<a name="checkbox"></a>
### Checkbox

Creates a Checkbox instance with a default set of options and returns the instance.

#### Constructor(HTMLElement, [options])
Just your element, and options. the options will be merged with defaults.


```javascript
var myCheckboxInput = document.getElementById('input-checkbox');
var checkboxInstance = new Checkbox({
    el: myCheckboxInput
});
```

#### Checkbox defaults

The defaults when creating an instance that are merged with your options.

##### el: null
The input element (with a type attribute of 'checkbox') that will be used.

##### onChecked: null
A callback that is fired when the checkbox is checked.

##### onUnchecked: null
A callback that is fired when the checkbox is un-checked.

##### cssPrefix: 'ui-checkbox'
A css class name that will be used as a prefix for all css classes added and removed from checkbox programmatically.


<a name="methods"></a>
#### Methods

##### setup()
Setup sets up the checkbox instance by doing the following:
* Adds all initial css classes
* Sets up click event listeners

##### destroy()
Unbinds all events and input events and makes the checkbox instance unusable.