# AKQA Web Framework

## Contents

1. [Summary](#summary)
1. [Installation](#installation)
1. [Usage](#usage)
1. [Development](#development)
1. [Release History](#release-history)

<a name="summary"></a>
## Summary
AKQA Web Framework is a internal framework built to standardize development and increase velocity across all web-based, front-end AKQA apps.

Everything built in this framework is vanilla javascript to eliminate dependencies which means things will process a lot faster than libraries like [jQuery](http://jquery.com/) and [Dojo](http://dojotoolkit.org/) and contain a lot less bloat. It also supports IE8+ and all modern browsers (including mobile).

<a name="installation"></a>

## Installation

### Dependencies

#### NodeJS

You can install Node.js via the package provided on [their site](http://www.nodejs.org).

#### Apache Setup

In your hosts file, add the following entry:

```
0.0.0.0       web-framework.dc.akqa.com
```

#### AKQA Core

You must install AKQA Core package globally by typing the following in your terminal while connected to the AKQA internal network:

```
npm install git+ssh://git@github.com/AKQADC/AKQA-Core.git  -g
```

Then, add this package to your project to your `package.json` file:

```javascript
{
    "devDependencies": {
        "akqa-web-framework": "git+ssh://git@github.com/AKQADC/AKQA-Web-Framework.git#[VERSION]" // the [VERSION] of the package to use
    }
}
```

Then run:

```
npm install
```

Then, add your build destination to the `core.packages` config in your `package.json` file:

```javascript
{
    "core": {
        "packageDest": "path/to/deploy/folder", // where you want the library files injected to be available to your build
        "packages": {
            "akqa-web-framework": {
                "dirName": "new-name" // optional: if you want to rename the folder of the core module
            }
        }
    }
}
```

Then run:

```
core build-deps
```

<a name="usage"></a>
## Usage

To use the javascript library of classes that Web Framework provides, you will need to first make sure you're using [RequireJS](http://requirejs.org/).

Then,specify where your web-framework modules are located in your `paths` configuration of your require config:

```
require.config({
    paths: {
            framework: '/path/to/web-framework/module'
        }
    }
);
```

Then you're free to use any javascript module provided by web framework.

__Please note that your module ID for require must be 'framework' as we have reserved this module ID for all framework modules.__

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

The following are tasks that are available when developing on Web Framework.

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


