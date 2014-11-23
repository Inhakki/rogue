# Rogue

Rogue is a internal framework built to standardize development and increase velocity across all web-based, front-end AKQA apps.

Everything built in this framework is vanilla javascript to eliminate dependencies which means things will process a lot faster than libraries like [jQuery](http://jquery.com/) and [Dojo](http://dojotoolkit.org/) and contain a lot less bloat. It also supports IE9+ and all modern browsers (including mobile).

## Included Libraries

* [RequireJS](http://requirejs.org/)

## Dependencies

#### NodeJS / NPM

You can install [Node.js](http://www.nodejs.org/) via the package provided on [their site](http://www.nodejs.org). Installing node will also install the [Node Package Manager](https://github.com/npm/npm) (NPM) to download and install node modules.

### Installation

First, you will need set your NPM registry to download modules using our internal private node registry by typing the following:

```
npm set registry http://npm.dc.akqa.com:4873/
```

Then, declare that you want to install rogue by adding it to your `package.json` file (just as you would any other node module):

```javascript
{
    "devDependencies": {
        "rogue": "[VERSION]"
    }
}
```

Then install rogue by running:

```
npm install
```

<a name="usage"></a>
## Usage

To use the javascript library of classes that Rogue provides, you will need to first make sure you're using [RequireJS](http://requirejs.org/).

1. inject the files from the node_modules folder into your project for use. You can do this using [npmcopy](https://github.com/timmywil/grunt-npmcopy).
1. specify the location of where you've injected the files in your RequireJS configuration.

Then you're free to use any [module provided by Rogue](https://github.com/AKQADC/rogue/blob/master/EXAMPLES.md).

## Contributing

To contribute to Rogue, check out the [Contributing readme](https://github.com/AKQADC/rogue/blob/master/CONTRIBUTING.md).

## Release History

 * 2014-10-23   v2.0.3   Modules are now IE9 compatible.
