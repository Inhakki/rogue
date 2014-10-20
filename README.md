# Rogue

## Contents

1. [Summary](#summary)
1. [Installation](#installation)
1. [Usage](#usage)
1. [Development](#development)
1. [Release History](#release-history)

<a name="summary"></a>
## Summary
Rogue is a internal framework built to standardize development and increase velocity across all web-based, front-end AKQA apps.

Everything built in this framework is vanilla javascript to eliminate dependencies which means things will process a lot faster than libraries like [jQuery](http://jquery.com/) and [Dojo](http://dojotoolkit.org/) and contain a lot less bloat. It also supports IE8+ and all modern browsers (including mobile).

<a name="installation"></a>

## Setup

### Dependencies

#### NodeJS / NPM

You can install [Node.js](http://www.nodejs.org/) via the package provided on [their site](http://www.nodejs.org). Installing node will also install the [Node Package Manager](https://github.com/npm/npm) (NPM) to download and install node modules.

#### Apache

In your hosts file, add the following entry:

```
0.0.0.0       rogue.dc.akqa.com
```

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

Then, you'll want to inject the files into your project for use. You can do this using [npmcopy](https://github.com/timmywil/grunt-npmcopy).

<a name="usage"></a>
## Usage

To use the javascript library of classes that Rogue provides, you will need to first make sure you're using [RequireJS](http://requirejs.org/).

Then, specify the location of where you've injected the files in your RequireJS configuration.

Then you're free to use any javascript module provided by Rogue.

<a name="development"></a>
## Development

### Tasks

The following are tasks that are available when developing on Rogue.

#### make server

Starts a web server to make the entire project "browseable".  To run the server:

```
make server
```

#### make test

Runs all tests on the project (currently all tests are written in QUnit).  This does the following:
* starts a headless web server
* runs all tests in the [QUnit](http://qunitjs.com) tests/index.html file

```
make test
```

_Tests can also be run via browser by running `make server` and just browsing to the tests/index.html file._


