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

#### NodeJS

You can install Node.js via the package provided on [their site](http://www.nodejs.org).

#### Apache

In your hosts file, add the following entry:

```
0.0.0.0       web-framework.dc.akqa.com
```

#### AKQA Core

You must first [install AKQA Core package globally](https://github.com/AKQADC/AKQA-Core#global-install).


### Installation

Then download rogue by adding it to your `package.json` file:

```javascript
{
    "devDependencies": {
        "rogue": "[VERSION]"
    }
}
```

Then install it by running:

```
npm install
```

Then, you'll want to inject the files into your project for use. You can do this using [AKQA-Core's `build-deps` command](https://github.com/AKQADC/AKQA-Core#build-deps).

<a name="usage"></a>
## Usage

To use the javascript library of classes that Rogue provides, you will need to first make sure you're using [RequireJS](http://requirejs.org/).

Then, specify where your rogue modules are located (where you've injected them using the `build-deps` command) in your `paths` configuration of your require config:

```
require.config({
    paths: {
            rogue: '/path/to/core-modules/rogue/module'
        }
    }
);
```

Then you're free to use any javascript module provided by Rogue.

__Please note that your module ID for require must be 'rogue' as we have reserved this module ID for all rogue modules.__

<a name="development"></a>
## Development

### Folder Structure

The project is set up as follows:

* **grunt** - Files for grunt configuration
* **samples** - A folder that can be browsed to see all module usage
* **tests** - Test files
* **workspace** - Parent folder for development (This folder is what is distributed when the package is installed in other projects)
    * **libs** - Project libraries
    * **ui** - All ui-based modules (form fields, toggle buttons, etc.)

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


